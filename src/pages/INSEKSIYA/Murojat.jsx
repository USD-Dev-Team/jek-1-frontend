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

export default function Murojat() {
  const FILE_BASE = "https://api.usdsoft.uz/jek";

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
    pending: { label: "Pending", bg: "orange.500", color: "white" },
    in_progress: { label: "In Progress", bg: "blue.500", color: "white" },
    completed: { label: "Completed", bg: "green.500", color: "white" },
    rejected: { label: "Rejected", bg: "red.500", color: "white" },
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
      <Heading fontSize={25}>Murojaatlar (Inspection)</Heading>

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
      placeholder="Hammasi"
      onChange={(e) =>
        setForm({ ...form, status: e.target.value })
      }
    >
      <option value="PENDING">Kutilmoqda</option>
      <option value="IN_PROGRESS">Jarayonda</option>
      <option value="COMPLETED">Bajarildi</option>
      <option value="REJECTED">Rad etilgan</option>
    </Select>

    <Select
      minW="160px"
      placeholder="Hammasi"
      onChange={(e) =>
        setForm({ ...form, district: e.target.value })
      }
    >
      <option value="Chilonzor">Chilonzor</option>
      <option value="Yunusobod">Yunusobod</option>
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
              <Th>USER</Th>
              <Th>HUDUD</Th>
              <Th>HODIM</Th>
              <Th>DATE</Th>
              <Th>DAVOMIYLIK</Th>
              <Th>STATUS</Th>
              <Th textAlign="right">ACTION</Th>
            </Tr>
          </Thead>

        <Tbody>
  {loading ? (
    <TableSkeleton rows={5} columns={8} />
  ) : data.length === 0 ? (
    <Tr>
      <Td colSpan={8} textAlign="center">
        Ma'lumot topilmadi
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

          {/* USER */}
          <Td>
            <Text>{item.user?.full_name}</Text>
            <Text fontSize="xs">{item.phone}</Text>
          </Td>

          {/* HUDUD */}
          <Td>{item.address?.district}</Td>

          {/* HODIM */}
          <Td>
            {workerMap[item.assigned_jek_id]
              ? `${workerMap[item.assigned_jek_id].first_name} ${workerMap[item.assigned_jek_id].last_name}`
              : "-"}
          </Td>

          {/* DATE */}
          <Td>{formatDateTime(item.createdAt)}</Td>

          {/* DAVOMIYLIK */}
          <Td>{days} kun</Td>

          {/* STATUS */}
          <Td>
            <Badge bg={status.bg} color={status.color}>
              {status.label}
            </Badge>
          </Td>

          {/* ACTION */}
          <Td textAlign="right">
            {item.status?.toLowerCase() !== "jek_completed" && (
              <Button
                size="sm"
                onClick={() => {
                  setSelected(item);
                  viewModal.onOpen();
                }}
              >
                View
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

      {/* PAGINATION */}
      <Flex mt={6} justify="center" gap={3}>
        <Button
          size="sm"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          ← Oldingi
        </Button>

        <Box px={4}>{page}</Box>

        <Button
          size="sm"
          onClick={() => setPage((p) => p + 1)}
        >
          Keyingi →
        </Button>
      </Flex>

      {/* VIEW MODAL */}
      <Modal isOpen={viewModal.isOpen} onClose={viewModal.onClose} size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="md">
          <ModalHeader borderBottom="1px solid" borderColor="gray.200">
            Ariza ma'lumotlari
          </ModalHeader>

          <ModalBody py={4}>
            <VStack align="stretch" spacing={3}>
              <Flex justify="space-between">
                <Text color="gray.500">Ariza raqami:</Text>
                <Text fontWeight="500">{selected?.request_number}</Text>
              </Flex>

              <Flex justify="space-between">
                <Text color="gray.500">Foydalanuvchi:</Text>
                <Text>{selected?.user?.full_name}</Text>
              </Flex>

              <Flex justify="space-between">
                <Text color="gray.500">Telefon:</Text>
                <Text>{selected?.user?.phoneNumber}</Text>
              </Flex>

              <Flex justify="space-between">
                <Text color="gray.500">Tuman:</Text>
                <Text>{selected?.address?.district}</Text>
              </Flex>

              <Flex justify="space-between">
                <Text color="gray.500">Mahalla:</Text>
                <Text>{selected?.address?.neighborhood}</Text>
              </Flex>

              <Flex justify="space-between">
                <Text color="gray.500">Uy:</Text>
                <Text>
                  {selected?.address?.building_number} /{" "}
                  {selected?.address?.apartment_number}
                </Text>
              </Flex>

              <Box>
                <Text color="gray.500" mb={1}>
                  Muammo:
                </Text>
                <Text>{selected?.description}</Text>
              </Box>

              <Box>
                <Text color="gray.500" mb={1}>
                  Izoh:
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
              </Flex>
            </VStack>
          </ModalBody>

          <ModalFooter gap={4} borderTop="1px solid" borderColor="gray.200">
            <Button size="sm" onClick={viewModal.onClose}>
              Yopish
            </Button>
            {selected?.status?.toLowerCase().includes("rejected") && (
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => getStartRequest(selected?.id)}
              >
                Qaytadan boshlash
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
}