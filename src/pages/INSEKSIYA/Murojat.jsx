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
  Heading,
  Select,
  VStack,
  Image
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import TableSkeleton from "../../components/ui/TableSkeleton";
import { Requests } from "../../Services/api/Requests";
import { formatDateTime } from "../../utils/tools/formatDateTime";
import { useTranslation } from "react-i18next";

export default function Murojat() {
  const FILE_BASE = "https://api.usdsoft.uz/jek";
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState([]);
  const [debouncedQwery, setDebouncedQwery] = useState("");
  const [page, setPage] = useState(1);
  const  [workers, setWorkers] = useState([])
  const [previewImg, setPreviewImg] = useState(null);


  const hoverBg = useColorModeValue("neutral.100", "neutral.700");

  const viewModal = useDisclosure();

  const [form, setForm] = useState({
    startData: new Date().toISOString().split("T")[0],
    endData: new Date().toISOString().split("T")[0],
    status: "",
    district: "",

    search: "",
  });

 const statusMap = {
  pending: {
    label: t("inspection.status.pending"),
    bg: "orange.500",
    color: "white",
  },
  in_progress: {
    label: t("inspection.status.in_progress"),
    bg: "blue.500",
    color: "white",
  },
  completed: {
    label: t("inspection.status.completed"),
    bg: "green.500",
    color: "white",
  },
  rejected: {
    label: t("inspection.status.rejected"),
    bg: "red.500",
    color: "white",
  },
   jek_completed: {
    label: t("inspection.status.jek_completed"),
    bg: "green",
    color: "white",
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

  const getWorkers = async ()=>{
    setLoading(true)
    try{
      const res = await Requests.getEmploye(true)
      setWorkers(res.data.data)
     

    }finally{
      setLoading(false)
    }
  }

  
  

  useEffect(()=>{
    getWorkers()
  },[])



const openImage = (url) => {
  setPreviewImg(url);
};

  const workerMap = Object.fromEntries(workers.map(w => [w.id, w]))

  const getData = async (text) => {
    try {
      setLoading(true);

      const res = await Requests.getFilteredRequest(
        form.startData,
        form.endData,
        form.district,
        null,
        form.status,
        text,
        page - 1,
        20
      );

      setData(res.data.data);
   
      
    } finally {
      setLoading(false);
     
    }
  };

  useEffect(() => {
    const time = setTimeout(() => {
      setDebouncedQwery(form.search);
    }, 400);
  

    return () => clearTimeout(time);
  }, [form.search]);

  useEffect(() => {
    getData(debouncedQwery);
  }, [form.startData, form.endData, form.status, form.district, debouncedQwery, page]);

  return (
    <Box bg="bg" minH="100vh" p={6}>
     <Heading fontSize={25}>{t("inspection.title")}</Heading>

      {/* FILTER */}
    <Box  mb={6} mt={6}>  
  <Flex
    gap={3}
    align="center"
    wrap="nowrap"
    overflowX="auto"
  >

    <Input
      placeholder="Search..."
      value={form.search}
      onChange={(e) =>
        setForm({ ...form, search: e.target.value })
      }
      minW="200px"
    />

    <Select
      minW="160px"
     placeholder={t("inspection.all")}
      onChange={(e) =>
        setForm({ ...form, status: e.target.value })
      }
    >
     <option value="PENDING">{t("inspection.status.pending")}</option>
      <option value="IN_PROGRESS">{t("inspection.status.in_progress")}</option>
     <option value="COMPLETED">{t("inspection.status.completed")}</option>
     <option value="REJECTED">{t("inspection.status.rejected")}</option>
    </Select>

    <Select
      minW="160px"
    placeholder={t("inspection.all")}
      onChange={(e) =>
        setForm({ ...form, district: e.target.value })
      }
    >
 
    </Select>

    <Input
      type="date"
      minW="150px"
      value={form.startData}
      onChange={(e) =>
        setForm({ ...form, startData: e.target.value })
      }
    />

    <Input
      type="date"
      minW="150px"
      value={form.endData}
      onChange={(e) =>
        setForm({ ...form, endData: e.target.value })
      }
    />

  </Flex>
</Box>

      {/* TABLE */}
      <Box bg="surface" borderRadius="xl" border="1px solid" borderColor="border" p={5}>
        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
             <Th>{t("inspection.user")}</Th>
<Th>{t("inspection.region")}</Th>
<Th>{t("inspection.date")}</Th>
<Th>{t("inspection.duration")}</Th>
<Th>{t("inspection.status_label")}</Th>
<Th textAlign="center">{t("inspection.action")}</Th>
            </Tr>
          </Thead>

        <Tbody>
  {loading ? (
    <TableSkeleton rows={5} columns={8} />
  ) : data.length === 0 ? (
    <Tr>
      <Td colSpan={8} textAlign="center">
       {t("inspection.empty")}
      </Td>
    </Tr>
  ) : (
    data.map((item) => {
      const status = getStatus(item.status);

      const days =
        Math.ceil(
          (new Date(item.updatedAt) -
            new Date(item.createdAt)) /
            (1000 * 60 * 60 * 24)
        ) || 0;

      return (
        <Tr key={item.id} _hover={{ bg: hoverBg }}>
          
          {/* ID */}
          <Td>{item.request_number}</Td>


          <Td>
            <Text>{item.user?.full_name}</Text>
            <Text fontSize="xs">{item.phone}</Text>
          </Td>


          <Td>{item.address?.district}</Td>


         


          <Td>{formatDateTime(item.createdAt)}</Td>


          <Td>{days} kun</Td>

        
          <Td>
            <Badge bg={status.bg} color={status.color}>
              {status.label}
            </Badge>
          </Td>


          <Td textAlign="right">
            {item.status?.toLowerCase() !== "jek_completed" && (
              <Button
                size="sm"
                onClick={() => {
                  setSelected(item);
                  viewModal.onOpen();
                }}
              >
            {t("inspection.view")}
              </Button>
            )}
          </Td>

        </Tr>
      );
    })
  )}
</Tbody>
        </Table>
      </Box>


      <Flex mt={6} justify="center" gap={3}>
        <Button
          size="sm"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          ← {t("inspection.prev")}
        </Button>

        <Box px={4}>{page}</Box>

        <Button
          size="sm"
          onClick={() => setPage((p) => p + 1)}
        >
          {t("inspection.next")}→
        </Button>
      </Flex>

      {/* VIEW MODAL */}
      <Modal isOpen={viewModal.isOpen} onClose={viewModal.onClose} size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="md">
          <ModalHeader borderBottom="1px solid" borderColor="gray.200">
           {t("inspection.modal.title")}
          </ModalHeader>

          <ModalBody py={4}>
            <VStack align="stretch" spacing={3}>
              <Flex justify="space-between">
                <Text color="gray.500">{t("inspection.fields.request_number")}</Text>
                <Text fontWeight="500">{selected?.request_number}</Text>
              </Flex>

              <Flex justify="space-between">
                <Text color="gray.500">{t("inspection.fields.user")}</Text>
                <Text>{selected?.user?.full_name}</Text>
              </Flex>

              <Flex justify="space-between">
                <Text color="gray.500">{t("inspection.fields.user")}</Text>
                <Text>{selected?.user?.phoneNumber}</Text>
              </Flex>

              <Flex justify="space-between">
                <Text color="gray.500">{t("inspection.fields.district")}</Text>
                <Text>{selected?.address?.district}</Text>
              </Flex>

              <Flex justify="space-between">
                <Text color="gray.500">{t("inspection.fields.neighborhood")}</Text>
                <Text>{selected?.address?.neighborhood}</Text>
              </Flex>

              <Flex justify="space-between">
                <Text color="gray.500">{t("inspection.fields.house")}</Text>
                <Text>
                  {selected?.address?.building_number} /{" "}
                  {selected?.address?.apartment_number}
                </Text>
              </Flex>

              <Box>
                <Text color="gray.500" mb={1}>
                {t("inspection.fields.problem")}
                </Text>
                <Text>{selected?.description}</Text>
              </Box>

              <Box>
                <Text color="gray.500" mb={1}>
             {t("inspection.fields.note")}
                </Text>
                <Box
                  border="1px solid"
                  borderColor="gray.200"
                  p={2}
                  borderRadius="sm"
                >
                  {selected?.note || "-"}
                </Box>
              </Box>

              <Flex gap={2} wrap="wrap">
                {selected?.requestPhotos?.map((img) => (
                  <Box
                    key={img.id}
                    w="200px"
                    h="200px"
                    borderRadius="12px"
                    overflow="hidden"
                    border="1px solid"
                    borderColor="gray.200"
                    cursor="pointer"
                    transition="0.2s"
                    _hover={{
                      transform: "scale(1.05)",
                      boxShadow: "lg",
                    }}
                  >
                   <Image
  src={previewImg}
  w="100%"
  h="100%"
  objectFit="cover"
  onClick={() => openImage(`${FILE_BASE}${img.file_url}`)}
/>
                  </Box>
                ))}
                <Image
                
                src=""/>
              
              </Flex>
            </VStack>
          </ModalBody>

          <ModalFooter gap={4} borderTop="1px solid" borderColor="gray.200">
            <Button size="sm" onClick={viewModal.onClose}>
          {t("inspection.close")}
            </Button>
            {selected?.status?.toLowerCase().includes("rejected") && (
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => getStartRequest(selected?.id)}
              >
            {t("inspection.restart")}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
}