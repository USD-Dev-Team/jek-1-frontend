import {
  Box,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Flex,
  Text,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Heading,
  Select,
  VStack,
  Image,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TableSkeleton from "../../../components/ui/TableSkeleton";
import { Requests } from "../../../Services/api/Requests";
import { formatDateTime } from "../../../utils/tools/formatDateTime";
import { SelfData } from "../../../Services/api/SelfData";
import { toastService } from "../../../utils/toast";

export default function Murojat() {
  const { t } = useTranslation();
  const FILE_BASE = "https://api.usdsoft.uz/jek";
  const [previewImg, setPreviewImg] = useState(null);

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState("");
  const [data, setData] = useState([]);
  // const totalPages = data?.pagination?.totalPages
  const [jek, setJek] = useState([]);
  const [debouncedQwery, setDebouncedQwery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);

  const hoverBg = useColorModeValue("neutral.100", "neutral.700");

  const startModal = useDisclosure();
  const finishModal = useDisclosure();
  const viewModal = useDisclosure();

  const getJek = async () => {
    try {
      setLoading(true);
      const res = await SelfData.getData();
      setJek(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getJek();
  }, []);

  const statusMap = {
    pending: {
      label: t("murojat.status.pending"),
      bg: "warningBg",
      color: "warning",
    },
    in_progress: {
      label: t("murojat.status.in_progress"),
      bg: "infoBg",
      color: "info",
    },
    completed: {
      label: t("murojat.status.completed"),
      bg: "successBg",
      color: "success",
    },
    rejected: {
      label: t("murojat.status.rejected"),
      bg: "dangerBg",
      color: "danger",
    },
     jek_completed: {
    label: t("murojat.status.jek_completed"),
    bg: "green.700",
    color: "green.200",
  },
  };

  const getStatus = (status) => {
    return (
      statusMap[status?.toLowerCase()] || {
        label: status,
        bg: "gray.200",
        color: "gray.600",
      }
    );
  };

  const [form, setForm] = useState({
    startData: new Date().toISOString().split("T")[0],
    endData: new Date().toISOString().split("T")[0],
    status: "" || null,
    search: "",
  });

  const getData = async (text) => {
    try {
      setLoading(true);
      const res = await Requests.getFilteredRequest(
        form.startData,
        form.endData,
        jek?.addresses?.[0]?.district || "",
        jek?.addresses?.[0]?.neighborhood || "",
        form.status,
        text,
        page - 1,
        limit,
      );

      setData(res.data.data);

    }finally {
      setLoading(false);
    

    }
  };

  useEffect(() => {
    const time = setTimeout(() => {
      setDebouncedQwery(form.search);
    }, 500);
    return () => clearTimeout(time);
  }, [form.search]);

useEffect(() => {
  if (!form.startData || !form.endData) return;

  if (jek?.addresses?.length > 0) {
    getData(debouncedQwery);
  }
}, [
    jek,
    form.startData,
    form.endData,
    form.status,
    debouncedQwery,
    page,
    limit,
  ]);
const openImage = (url) => {
  setPreviewImg(url);
};

  const complete = async () => {
    try {
      setLoading(true);
      await Requests.Complete(selected?.id, reason);
      finishModal.onClose();
      setReason("");
      getData();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getStartRequest = async (id) => {
    try {
      setLoading(true);

      await Requests.getStart(id);

      viewModal.onClose();
      startModal.onClose();
      getData();
    } catch(err){
      toastService.error( err?.response?.data?.message || "Xatolik yuz berdi")
    }finally {
      setLoading(false);
   
    }
  };

  return (
    <Box bg="bg" minH="100vh" p={6}>
      <Heading fontSize={25}>{t("murojat.title")}</Heading>

      {/* FILTER */}
      <Box mr={3} mb={5} mt={8}>
        <Flex gap={3} align="center" wrap="nowrap" overflowX="auto">
          <Input
            placeholder={t("murojat.search_placeholder")}
            value={form.search}
            onChange={(e) => setForm({ ...form, search: e.target.value })}
            minW="220px"
          />

          <Select
            minW="180px"
            value={form.status || ""}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value || null,
              })
            }
          >
            <option value="">{t("murojat.table.all")}</option>
          <option value="PENDING">{t("murojat.status.pending")}</option>
           <option value="IN_PROGRESS">{t("murojat.status.in_progress")}</option>
          <option value="COMPLETED">{t("murojat.status.completed")}</option>
           <option value="REJECTED">{t("murojat.status.rejected")}</option>
          </Select>

          <Input
            type="date"
            minW="160px"
            value={form.startData}
            onChange={(e) => setForm({ ...form, startData: e.target.value })}
          />

          <Input
            type="date"
            minW="160px"
            value={form.endData}
            onChange={(e) => setForm({ ...form, endData: e.target.value })}
          />
        </Flex>
      </Box>

      {/* TABLE */}

      <Box
        bg="surface"
        borderRadius="xl"
        border="1px solid"
        borderColor="border"
        p={5}
        mr={3}
      >
        <Table>
          <Thead>
            <Tr>
               <Th>#</Th>
            <Th>{t("murojat.table.id")}</Th>
             <Th>{t("murojat.table.user")}</Th>
            <Th>{t("murojat.table.date")}</Th>
          <Th>{t("murojat.table.status")}</Th>
             <Th>{t("murojat.table.actions")}</Th>
            
            </Tr>
          </Thead>

          <Tbody>
            {loading ? (
              <TableSkeleton rows={5} columns={5} />
            ) : data.length === 0 ? (
              <Tr>
                <Td colSpan={5} textAlign="center" py={10} color="gray.500">
              {t("murojat.table.empty")}
                </Td>
              </Tr>
            ) : (
              data.map((item, index) => {
                const status = getStatus(item.status);

                return (
                  <Tr key={item.id} _hover={{ bg: hoverBg }}>
                    <Td>{index+1}</Td>
                    <Td fontWeight="600">{item.request_number}</Td>

                    <Td>
                      <Text>{item.user.full_name}</Text>
                      <Text fontSize="xs" color="gray.500">
                        {item.phone}
                      </Text>
                    </Td>

                    <Td>{formatDateTime(item.createdAt)}</Td>

                    <Td>
                      <Badge bg={status.bg} color={status.color}>
                        {status.label}
                      </Badge>
                    </Td>

                    <Td textAlign="right">
                      <Flex justify="flex-end" gap={2}>
                        {item.status?.toLowerCase() === "pending" && (
                          <Button
                            size="sm"
                            variant="solidPrimary"
                            onClick={() => {
                              setSelected(item);
                              viewModal.onOpen();
                            }}
                          > {t("murojat.buttons.view")}</Button>
                        )}

                        {item.status?.toLowerCase() === "in_progress" && (
                          <Button
                            size="sm"
                            bg="green.500"
                            color="white"
                            onClick={() => {
                              setSelected(item);
                              finishModal.onOpen();
                            }}
                          >
                          {t("murojat.buttons.finish")}
                          </Button>
                        )}

                        {["rejected", "completed"].includes(
                          item.status?.toLowerCase(),
                        ) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelected(item);
                              viewModal.onOpen();
                            }}
                          >
                          {t("murojat.buttons.view")}
                          </Button>
                        )}
                      </Flex>
                    </Td>
                  </Tr>
                );
              })
            )}
          </Tbody>
        </Table>
      </Box>

      {/*  PAGINATION */}
      <Flex mt={6} justify="center" align="center" gap={2}>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          isDisabled={page === 1}
        >
          ← {t("murojat.pagination.prev")}
        </Button>

        <Box
          px={4}
          py={1}
          border="1px solid"
          borderColor="gray.300"
          borderRadius="md"
          fontSize="sm"
          fontWeight="600"
        >
          {page}
        </Box>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setPage((p) => p + 1)}
        isDisabled={data.length < limit}
        >
        {t("murojat.pagination.next")} →
        </Button>
      </Flex>

      <Modal isOpen={startModal.isOpen} onClose={startModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("murojat.modals.start_title")}</ModalHeader>
          <ModalBody>{t("murojat.modals.start_text")}</ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={startModal.onClose}>
              {t("murojat.buttons.cancel")}
            </Button>
            <Button
              onClick={() => getStartRequest(selected?.id)}
              variant="solidPrimary"
            >
              {t("murojat.buttons.confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* FINISH MODAL */}
      <Modal isOpen={finishModal.isOpen} onClose={finishModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("murojat.modals.finish_title")}</ModalHeader>
          <ModalBody>
            <VStack spacing={5} align="stretch">
              <Box
                border="2px dashed"
                borderColor="gray.500"
                borderRadius="xl"
                p={4}
                textAlign="center"
                cursor="pointer"
                transition="0.2s"
                _hover={{
                  borderColor: "blue.400",
                  bg: "whiteAlpha.50",
                }}
              >
                <Text fontSize="sm" color="gray.400">
             {t("murojat.upload.placeholder")}
                </Text>

                <Input
                  type="file"
                  multiple
                  opacity={0}
                  position="absolute"
                  left={0}
                  top={0}
                  w="100%"
                  h="100%"
                  cursor="pointer"
                />
              </Box>

              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Izoh (kamida 10 ta)"
                minH="120px"
                borderRadius="xl"
                bg="whiteAlpha.50"
                border="1px solid"
                borderColor="whiteAlpha.200"
                _focus={{
                  borderColor: "blue.400",
                  boxShadow: "0 0 0 1px #3182ce",
                }}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={finishModal.onClose}>
              {t("murojat.buttons.cancel")}
            </Button>
            <Button onClick={complete}>{t("murojat.buttons.submit")}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* viewModal*/}

     <Modal isOpen={viewModal.isOpen} onClose={viewModal.onClose} size="lg">
  <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(4px)" />

  <ModalContent
    borderRadius="lg"
    bg="surface"
    color="gray.800"
    boxShadow="xl"
  >
    {/* HEADER */}
    <ModalHeader
      borderBottom="1px solid"
      borderColor="gray.200"
      fontWeight="600"
      fontSize="lg"
    >
      {t("murojat.ariza.malumotlari")}
    </ModalHeader>

    {/* BODY */}
    <ModalBody py={5}>
      <VStack align="stretch" spacing={4}>

        {/* ROW */}
        <Flex justify="space-between">
          <Text color="gray.500" fontSize="sm">
            {t("murojat.ariza.raqami")}
          </Text>
          <Text color={"gray.200"} fontWeight="500">{selected?.request_number}</Text>
        </Flex>

        <Flex justify="space-between">
          <Text color="gray.500" fontSize="sm">
            {t("murojat.foydalanuvchi")}
          </Text>
          <Text color={"gray.200"}>{selected?.user?.full_name}</Text>
        </Flex>

        <Flex justify="space-between">
          <Text color="gray.500" fontSize="sm">
            {t("murojat.telefon")}
          </Text>
          <Text color={"gray.200"}>{selected?.user?.phoneNumber}</Text>
        </Flex>

        <Flex justify="space-between">
          <Text color="gray.500" fontSize="sm">
            {t("murojat.tuman")}
          </Text>
          <Text color={"gray.200"}>{selected?.address?.district}</Text>
        </Flex>

        <Flex justify="space-between">
          <Text color="gray.500" fontSize="sm">
            {t("murojat.mahalla")}
          </Text>
          <Text color={"gray.200"}>{selected?.address?.neighborhood}</Text>
        </Flex>

        <Flex justify="space-between">
          <Text color="gray.500" fontSize="sm">
            {t("murojat.uy")}
          </Text>
          <Text color={"gray.200"}>
            {selected?.address?.building_number} /{" "}
            {selected?.address?.apartment_number}
          </Text>
        </Flex>

        {/* DESCRIPTION */}
        <Box pt={2}>
          <Text color="gray.500" fontSize="sm" mb={1}>
            {t("murojat.muammo")}
          </Text>
          <Text color={"gray.200"} lineHeight="1.5">
            {selected?.description}
          </Text>
        </Box>

        {/* NOTE */}
        <Box>
          <Text color="gray.500" fontSize="sm" mb={1}>
            {t("murojat.izoh")}
          </Text>
         
            <Text color={"gray.200"} lineHeight="1.5">
            {selected?.note || "-"}
            </Text>

        </Box>

        {/* IMAGES */}
        <Flex gap={3} wrap="wrap" pt={2}>
          {selected?.requestPhotos?.map((img) => (
            <Box
              key={img.id}
              w="140px"
              h="140px"
              borderRadius="md"
              overflow="hidden"
              border="1px solid"
              borderColor="gray.200"
              cursor="pointer"
              _hover={{ opacity: 0.9 }}
            >
              <Image
                src={`${FILE_BASE}${img.file_url}`}
                w="100%"
                h="100%"
                objectFit="cover"
                onClick={() =>
                  openImage(`${FILE_BASE}${img.file_url}`)
                }
              />
            </Box>
          ))}
        </Flex>
      </VStack>
    </ModalBody>

    {/* FOOTER */}
    <ModalFooter
      borderTop="1px solid"
      borderColor="gray.200"
      gap={3}
    >
      <Button size="sm" variant="outline" onClick={viewModal.onClose}>
        {t("murojat.close")}
      </Button>

      {selected?.status?.toLowerCase() === "pending" && (
        <Button
          size="sm"
          colorScheme="green"
          onClick={() => getStartRequest(selected?.id)}
        >
          {t("murojat.buttons.start")}
        </Button>
      )}

      {selected?.status?.toLowerCase().includes("rejected") && (
        <Button
          size="sm"
          colorScheme="blue"
          onClick={() => getStartRequest(selected?.id)}
        >
          {t("murojat.qaytadan")}
        </Button>
      )}
    </ModalFooter>
  </ModalContent>
</Modal>

      {/*open Image */}
    <Modal
  isOpen={!!previewImg}
  onClose={() => setPreviewImg(null)}
  size="xl"
  isCentered
>
  <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(6px)" />

  <ModalContent bg="transparent" boxShadow="none">
    <ModalBody display="flex" justifyContent="center">
      <Image
        src={previewImg}
        maxH="80vh"
        borderRadius="12px"
        objectFit="contain"
      />
    </ModalBody>
  </ModalContent>
</Modal>
    </Box>
  );
}
