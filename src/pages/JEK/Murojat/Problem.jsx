import {
  Box,
  Flex,
  Text,
  Badge,
  Image,
  Button,
  Spinner,
  Textarea,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { Requests } from "../../../Services/api/Requests";
import { toastService } from "../../../utils/toast";

const STATUS_COLORS = {
  COMPLETED: "green",
  PENDING: "yellow",
  REJECTED: "red",
  IN_PROGRESS: "blue",
};

const STATUS_BORDER = {
  COMPLETED: "green.400",
  PENDING: "yellow.400",
  REJECTED: "red.400",
  IN_PROGRESS: "blue.400",
};

// helpers
function Field({ label, value, t }) {
  return (
    <Box mb={5}>
      <Text fontSize="xs" color="gray.400" mb={1}>
        {label}
      </Text>
      <Text fontSize="sm" fontWeight="500" color="white">
        {value || t("problem.no_data")}
      </Text>
    </Box>
  );
}

function PhotoGrid({ photos, onOpen, t }) {
  if (!photos?.length) {
    return (
      <Text fontSize="sm" color="gray.500">
        {t("problem.no_image")}
      </Text>
    );
  }

  const cols =
    photos.length === 1
      ? "1fr"
      : photos.length === 2
      ? "1fr 1fr"
      : "repeat(3, 1fr)";

  const h = photos.length === 1 ? "260px" : "160px";

  return (
    <Box display="grid" gridTemplateColumns={cols} gap={3}>
      {photos.map((img) => {
        const url = `https://api.usdsoft.uz/jek${img.file_url}`;

        return (
          <Image
            key={img.id}
            src={url}
            w="100%"
            h={h}
            borderRadius="lg"
            objectFit="cover"
            cursor="pointer"
            transition="0.2s"
            _hover={{ transform: "scale(1.03)" }}
            onClick={() => onOpen(url)}
          />
        );
      })}
    </Box>
  );
}

export default function Problem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [previewImg, setPreviewImg] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [files, setFiles] = useState([]);

  const {
    isOpen: isStartOpen,
    onOpen: onOpenStart,
    onClose: onCloseStart,
  } = useDisclosure();

  const {
    isOpen: isFinishOpen,
    onOpen: onOpenFinish,
    onClose: onCloseFinish,
  } = useDisclosure();

  const openImage = (url) => setPreviewImg(url);
  const closeImage = () => setPreviewImg(null);

  const getData = async () => {
    try {
      setLoading(true);
      const res = await Requests.getById(id);
      setData(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  const getStartRequest = async () => {
    try {
      setLoading(true);
      await Requests.getStart(data?.id);
      onCloseStart();
      getData();
    } catch (err) {
      toastService.error(err?.response?.data?.message || "Xatolik");
    } finally {
      setLoading(false);
    }
  };

  const complete = async () => {
    try {
      setLoading(true);
      await Requests.Complete(data?.id, reason, files);
      setReason("");
      setFiles([]);
      onCloseFinish();
      getData();
    } catch (err) {
      toastService.error(err?.response?.data?.message || "Xatolik");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <Flex minH="300px" align="center" justify="center">
        <Spinner size="lg" color="blue.400" />
      </Flex>
    );
  }

  if (!data) return null;

  const chatData = [
    ...(data?.history_notes?.JEK || []).map((item) => ({
      ...item,
      role: "JEK",
    })),
    ...(data?.history_notes?.USER || []).map((item) => ({
      ...item,
      role: "USER",
    })),
  ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <Box p={6}>
      <Text fontSize="28px" fontWeight="700">
        {t("problem.title")}
      </Text>

      {/* HEADER */}
      <Flex mt={6} justify="space-between" align="center" mb={6}>
        <Button variant="outline" onClick={() => navigate(-1)}>
          {t("problem.back")}
        </Button>

        <Flex gap={3}>
          {data.status === "PENDING" && (
            <Button onClick={onOpenStart}>
              {t("problem.start")}
            </Button>
          )}

          {data.status === "REJECTED" && (
            <Button onClick={onOpenStart}>
              {t("problem.restart")}
            </Button>
          )}

          {data.status === "IN_PROGRESS" && (
            <Button colorScheme="green" onClick={onOpenFinish}>
              {t("problem.finish")}
            </Button>
          )}
        </Flex>
      </Flex>

      {/* CARD */}
      <Box
        p={6}
        borderRadius="xl"
        borderTop="4px solid"
        borderTopColor={STATUS_BORDER[data.status]}
        bg="gray.800"
      >
        <Badge colorScheme={STATUS_COLORS[data.status]} mb={6}>
          {data.status}
        </Badge>

        <Box display="grid" gridTemplateColumns="400px 1fr">
          <Box>
            <Field t={t} label={t("problem.client")} value={data.user?.full_name} />

            <Field
              t={t}
              label={t("problem.assigned")}
              value={
                data.assigned_jek
                  ? `${data.assigned_jek.first_name} ${data.assigned_jek.last_name}`
                  : null
              }
            />

            <Field
              t={t}
              label={t("problem.created")}
              value={new Date(data.createdAt).toLocaleString("uz-UZ")}
            />

            {data.completedAt && (
              <Field
                t={t}
                label={t("problem.completed")}
                value={new Date(data.completedAt).toLocaleString("uz-UZ")}
              />
            )}
          </Box>

          <Box>
            <Text fontSize="xs" color="gray.400" mb={3}>
              {t("problem.images")}
            </Text>

            <PhotoGrid
              photos={data.requestPhotos}
              onOpen={openImage}
              t={t}
            />
          </Box>
        </Box>

        <Box>
          <Field t={t} label={t("problem.problem")} value={data.description} />
          <Field t={t} label={t("problem.note")} value={data.note} />
        </Box>
      </Box>

      {/* CHAT */}
      <Box mt={8}>
        <Text fontSize="sm" color="gray.400" mb={3}>
          {t("problem.history")}
        </Text>

        <Flex direction="column" gap={3}>
          {chatData.map((msg, index) => (
            <Flex
              key={index}
              justify={msg.role === "USER" ? "flex-end" : "flex-start"}
            >
              <Box
                maxW="60%"
                px={4}
                py={2}
                borderRadius="lg"
                bg={msg.role === "USER" ? "blue.500" : "gray.700"}
              >
                <Text fontSize="sm">{msg.note}</Text>
                <Text fontSize="10px" mt={1}>
                  {new Date(msg.createdAt).toLocaleString("uz-UZ")}
                </Text>
              </Box>
            </Flex>
          ))}
        </Flex>
      </Box>

      {/* MODALS */}
      <Modal isOpen={isStartOpen} onClose={onCloseStart} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {data.status === "REJECTED"
              ? t("problem.confirm_restart")
              : t("problem.confirm_start")}
          </ModalHeader>
          <ModalFooter>
            <Button onClick={onCloseStart}>{t("problem.no")}</Button>
            <Button isLoading={loading} onClick={getStartRequest}>
              {t("problem.yes")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isFinishOpen} onClose={onCloseFinish} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("problem.finish")}</ModalHeader>
          <ModalBody>
            <Textarea
              placeholder={t("problem.write_note")}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <Input
              mt={3}
              type="file"
              multiple
              onChange={(e) => setFiles([...e.target.files])}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseFinish}>{t("problem.cancel")}</Button>
            <Button isLoading={loading} onClick={complete}>
              {t("problem.send")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* IMAGE PREVIEW */}
      <Modal isOpen={!!previewImg} onClose={closeImage} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent bg="transparent">
          <ModalBody p={0}>
            <Image src={previewImg} w="100%" maxH="80vh" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}