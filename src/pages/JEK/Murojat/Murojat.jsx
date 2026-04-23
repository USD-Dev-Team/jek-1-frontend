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
  Icon,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TableSkeleton from "../../../components/ui/TableSkeleton";
import { Requests } from "../../../Services/api/Requests";
import { formatDateTime } from "../../../utils/tools/formatDateTime";
import { SelfData } from "../../../Services/api/SelfData";
import { toastService } from "../../../utils/toast";
import { Trash } from "lucide-react";
import { useNavigate } from "react-router";

export default function Murojat() {
  const { t } = useTranslation();
  const FILE_BASE = "https://api.usdsoft.uz/jek";
  const [previewImg, setPreviewImg] = useState(null);

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [jek, setJek] = useState([]);
  const [debouncedQwery, setDebouncedQwery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [meta, setMeta] = useState({});
  const [files, setFiles] = useState([]);

  const hoverBg = useColorModeValue("neutral.100", "neutral.700");

  // const startModal = useDisclosure();
  // const finishModal = useDisclosure();
  // const viewModal = useDisclosure();

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
    startData: "" || null,
    endData: "" || null,
    status: "" || null,
    search: "",
  });
  

  const getData = async (text) => {
    try {
      setLoading(true);
      const res = await Requests.getFilteredRequest(
        null,
        null,
        jek?.addresses?.[0]?.district || "",
        jek?.addresses?.[0]?.neighborhood || "",
        form.status,
        text,
        page ,
        limit,
      );

      setData(res.data.data);
      setMeta(res.data.meta);
    } finally {
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

//  const complete = async () => {
//   try {
//     setLoading(true);

//     await Requests.Complete(selected?.id, reason, files);

//     finishModal.onClose();
//     setReason("");
//     setFiles([]); 

//     getData();
//   } catch (err) {
//     toastService.error(err?.response?.data?.message || "Xatolik yuz berdi");
//   } finally {
//     setLoading(false);
//   }
// };

  // const getStartRequest = async (id) => {
  //   try {
  //     setLoading(true);

  //     await Requests.getStart(id);

  //     viewModal.onClose();
  //     startModal.onClose();
  //     getData();
  //   } catch (err) {
  //     toastService.error(err?.response?.data?.message || "Xatolik yuz berdi");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const filteredData = data.filter((item) => {
    if (!form.startData || !form.endData) return true;

    const itemDate = new Date(item.createdAt);
    const start = new Date(form.startData);
    const end = new Date(form.endData);

    end.setHours(23, 59, 59, 999);

    return itemDate >= start && itemDate <= end;
  });

  const clearFilters = () => {
  setForm({
    startData: null,
    endData: null,
    status: "",
    search: "",
  });

  setPage(1); 
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
            <option value="IN_PROGRESS">
              {t("murojat.status.in_progress")}
            </option>
            <option value="COMPLETED">{t("murojat.status.completed")}</option>
            <option value="REJECTED">{t("murojat.status.rejected")}</option>
            <option value="JEK_COMPLETED">{t("murojat.status.jek_completed")}</option>
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
          <Button
  minW="120px"
  variant="outline"
  onClick={clearFilters}
>
 <Icon as={Trash} boxSize={4} />
</Button>
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
       <Text fontFamily="mono" mb={3}>
 {t("murojat.murojat.total", { count: meta?.total || 0 })}
</Text>
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
              <TableSkeleton rows={5} columns={6} />
            ) : filteredData.length === 0 ? (
              <Tr>
                <Td colSpan={6} textAlign="center" py={10} color="gray.500">
                  <Text  fontSize="lg" mb={2}>

                  {t("murojat.table.empty")}
                  </Text>
                </Td>
              </Tr>
            ) : (
              filteredData.map((item, index) => {
                const status = getStatus(item.status);

                return (
                  <Tr key={item.id} _hover={{ bg: hoverBg }}>
                    <Td>{index + 1}</Td>
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

                    <Td textAlign="start" >
                      <Flex justify="flex-center" gap={2}>
                        {item.status?.toLowerCase() === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                             navigate(`/jek/murojat/${item.id}`);
                            }}
                          >
                            {" "}
                            {t("murojat.buttons.view")}
                          </Button>
                        )}
                        {item.status?.toLowerCase() === "in_progress" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                             navigate(`/jek/murojat/${item.id}`);
                            }}
                          >
                            {" "}
                            {t("murojat.buttons.view")}
                          </Button>
                        )}

                       

                        {["rejected", "completed"].includes(
                          item.status?.toLowerCase(),
                        ) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                             navigate(`/jek/murojat/${item.id}`);
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
{meta?.totalPages > 1 && filteredData.length > 0 && (
  <Flex mt={6} justify="center" align="center" gap={2}>
    <Button
      size="sm"
      variant="outline"
      onClick={() => setPage((p) => Math.max(p - 1, 1))}
      isDisabled={!meta?.hasPreviousPage}
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
      {meta.page} / {meta.totalPages}
    </Box>

    <Button
      size="sm"
      variant="outline"
      onClick={() => setPage((p) => p + 1)}
      isDisabled={!meta?.hasNextPage}
    >
      {t("murojat.pagination.next")} →
    </Button>
  </Flex>
)}

     
     

     
        
         

  
          

    
    </Box>
  );
}
