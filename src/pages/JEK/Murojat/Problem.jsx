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

// ─── helpers ────────────────────────────────────────────────────────────────
function Field({ label, value }) {
  return (
    <Box mb={5}>
      <Text
        fontSize="xs"
        color="gray.400"
        textTransform="uppercase"
        letterSpacing="wider"
        mb={1}
      >
        {label}
      </Text>
      <Text fontSize="sm" fontWeight="500" color="white">
        {value || "—"}
      </Text>
    </Box>
  );
}

function PhotoGrid({ photos }) {
  if (!photos?.length) {
    return (
      <Text fontSize="sm" color="gray.500">
        Rasm mavjud emas
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
      {photos.map((img) => (
        <Image
          key={img.id}
          src={`https://api.usdsoft.uz/jek${img.file_url}`}
          w="100%"
          h={h}
          borderRadius="lg"
          objectFit="cover"
          border="1px solid"
          borderColor="whiteAlpha.200"
        />
      ))}
    </Box>
  );
}


export default function Problem() {
  const { id } = useParams();
  const navigate = useNavigate();

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


  const getData = async () => {
    try {
      setLoading(true);
      const res = await Requests.getFilteredRequest(
        null,
        null,
        null,
        null,
        null,
        null,
       null,
       null
      );

   
    const item = res.data.data?.find((i) => i.id == id);

setData(item || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  // ── actions ────────────────────────────────────────────────────────────────
  const getStartRequest = async () => {
    try {
      setLoading(true);
      await Requests.getStart(data?.id);
      onCloseStart();
      getData();
    } catch (err) {
      toastService.error(err?.response?.data?.message || "Xatolik yuz berdi");
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
      toastService.error(err?.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // ── guards ─────────────────────────────────────────────────────────────────
  if (loading && !data) {
    return (
      <Flex minH="300px" align="center" justify="center">
        <Spinner size="lg" color="blue.400" thickness="3px" />
      </Flex>
    );
  }

  if (!data) return null;

  // ── render ─────────────────────────────────────────────────────────────────
 return (
  <Box p={6}>
    <Text fontSize="28px" fontWeight="700">
      Ariza ma'lumotlari
    </Text>

    {/* HEADER */}
    <Flex mt={6} justify="space-between" align="center" mb={6}>
      <Button variant="outline" onClick={() => navigate(-1)}>
        Orqaga
      </Button>

      <Flex gap={3}>
        {data.status === "PENDING" && (
          <Button colorScheme="blue" onClick={onOpenStart}>
            Boshlash
          </Button>
        )}

        {data.status === "REJECTED" && (
          <Button colorScheme="yellow" onClick={onOpenStart}>
            Qayta boshlash
          </Button>
        )}

        {data.status === "IN_PROGRESS" && (
          <Button colorScheme="green" onClick={onOpenFinish}>
            Tugatish
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

     
      <Box
        display="grid"
        gridTemplateColumns="400px 1fr "
        gap={0}
      >
        {/* LEFT */}
        <Box>
          <Field label="Arizachi" value={data.user?.full_name} />

          <Field
            label="Biriktirilgan xodim"
            value={
              data.assigned_jek
                ? `${data.assigned_jek.first_name} ${data.assigned_jek.last_name}`
                : "Biriktirilmagan"
            }
          />

          <Field
            label="Yaratilgan"
            value={
              data.createdAt
                ? new Date(data.createdAt).toLocaleString("uz-UZ")
                : undefined
            }
          />

          {data.completedAt && (
            <Field
              label="Tugatilgan"
              value={new Date(data.completedAt).toLocaleString("uz-UZ")}
            />
          )}
        </Box>

       

        {/* RIGHT */}
        <Box>
          <Text
            fontSize="xs"
            color="gray.400"
            textTransform="uppercase"
            mb={3}
          >
            Rasmlar
          </Text>

          <PhotoGrid photos={data.requestPhotos} />
        </Box>
         
      </Box>
      <Box>
          <Field label="Muammo" value={data.description} />

          <Field label="Izoh" value={data.note} />
        </Box>
    </Box>

    {/* START MODAL */}
    <Modal isOpen={isStartOpen} onClose={onCloseStart} isCentered>
      <ModalOverlay />
      <ModalContent bg="gray.800">
        <ModalHeader>
          {data.status === "REJECTED"
            ? "Qayta boshlashni tasdiqlaysizmi?"
            : "Rostdan ham boshlamoqchimisiz?"}
        </ModalHeader>
        <ModalFooter gap={3}>
          <Button onClick={onCloseStart}>Yo‘q</Button>
          <Button isLoading={loading} onClick={getStartRequest}>
            Ha
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

    {/* FINISH MODAL */}
    <Modal isOpen={isFinishOpen} onClose={onCloseFinish} isCentered>
      <ModalOverlay />
      <ModalContent bg="gray.800">
        <ModalHeader>Tugatish</ModalHeader>

        <ModalBody>
          <Textarea
            placeholder="Izoh yozing..."
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

        <ModalFooter gap={3}>
          <Button onClick={onCloseFinish}>Bekor qilish</Button>
          <Button
            isLoading={loading}
            isDisabled={!reason.trim()}
            onClick={complete}
          >
            Yuborish
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </Box>
);
}
