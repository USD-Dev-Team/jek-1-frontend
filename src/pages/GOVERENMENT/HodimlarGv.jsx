import React, { useState, useEffect, Fragment } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Circle,
  Collapse,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import {
  ChevronDown,
  ChevronUp,
  Pen,
  PenOff,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import destination from "../../constants/mahallas.json";

function EffRing({ value, color, t }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const colors = {
    blue: "#3b82f6",
    green: "#10b981",
    purple: "#8b5cf6",
    amber: "#f59e0b",
    red: "#ef4444",
    gray: "#6b7280",
  };
  const textColors = {
    blue: "blue.300",
    green: "green.300",
    purple: "purple.300",
    amber: "#FF7E00",
    red: "red.300",
    gray: "gray.400",
  };
  return (
    <Flex direction="column" align="center" justify="center" gap={1}>
      <Box position="relative" w="80px" h="80px">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="7"
          />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={colors[color] || "#3b82f6"}
            strokeWidth="7"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
          />
        </svg>
        <Flex position="absolute" inset="0" align="center" justify="center">
          <Text
            fontFamily="mono"
            fontSize="14px"
            fontWeight="700"
            color={textColors[color]}
          >
            {value}%
          </Text>
        </Flex>
      </Box>
      <Text fontSize="10px" color="gray.500">
        {t("hodim.hodim.hodim.bajarilgan")} / {t("hodim.hodim.hodim.jami")}
      </Text>
    </Flex>
  );
}

function MiniBar({ value, max = 142 }) {
  const pct = Math.round((value / max) * 100);
  return (
    <Flex align="center" gap={2}>
      <Text
        fontFamily="mono"
        fontSize="13px"
        fontWeight="600"
        color="green.400"
        minW="36px"
      >
        {value}
      </Text>
      <Box
        w="48px"
        h="4px"
        borderRadius="2px"
        bg="whiteAlpha.100"
        overflow="hidden"
      >
        <Box h="100%" w={`${pct}%`} bg="green.500" borderRadius="2px" />
      </Box>
    </Flex>
  );
}

import { Requests } from "../../Services/api/Requests";
import { toastService } from "../../utils/toast";
import { useNavigate } from "react-router";

export default function Hodimlari() {
  const { isOpen: isRemoveOpen, onOpen: openRemove, onClose: closeRemove, } = useDisclosure();
  const { isOpen: isAddressOpen, onOpen: openAddress, onClose: closeAddress, } = useDisclosure();
  const navigate = useNavigate();
  const [assignLoading, setAssignLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [removeHodim, setRemoveHodim] = useState(null);
  const [selectedHodim, setSelectedHodim] = useState(null);
  const [modalHudud, setModalHudud] = useState("");
  const [modalMahalla, setModalMahalla] = useState("");
  const modalMahallalar = modalHudud ? destination?.uz?.mahallas?.[modalHudud] || []  : [];
  const [hodimlar, setHodimlar] = useState([]);
  const [infod, setIinfod] = useState([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [hudud, setHudud] = useState("");
  const [mahalla, setMahalla] = useState("");
  const HUDUDLAR = destination.uz.addresses;

  const mahallalar = hudud ? destination?.uz?.mahallas?.[hudud] || [] : [];
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal, } = useDisclosure();

  const [search, setSearch] = useState("");
  const [holat, setHolat] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [pendingToggle, setPendingToggle] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});
  const limit = meta?.limit ?? 10;

  const fetchHodimlar = async () => {
    try {
      const res = await Requests.getEmploye({
        role: ["JEK"],
        page,

        first_name: debouncedSearch,
        last_name: debouncedSearch,

        district: hudud,
        neighborhood: mahalla,

        isActive: holat === "" ? undefined : holat === "aktiv" ? true : false,
      });

      const mapped = res.data.data.map((i) => ({
        id: i.id,
        ism: i.first_name,
        familiya: i.last_name,
        telefon: "+" + i.phoneNumber,
        role: i.role,
        hudud: i.addresses?.[0]?.address?.district,
        mahalla: i.addresses?.[0]?.address?.neighborhood,
        aktiv: i.isActive,
      }));

      setHodimlar(mapped);
      setMeta(res.data.meta);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);


  

  useEffect(() => {
    fetchHodimlar();
  }, [page, debouncedSearch, hudud, mahalla, holat]);

  const aktivCount = hodimlar.filter((h) => h.aktiv).length;
  const nofaolCount = hodimlar.length - aktivCount;
  const jamiCount = meta.total || 0;

  const hodimInfo = async (id) => {
    setLoading(true);
    try {
      const resi = await Requests.getUserInfo(id);
      setIinfod(resi?.data?.infod);
    } finally {
      setLoading(false);
    }
  };

  function clearFilter() {
    setSearch("");
    setHudud("");
    setMahalla("");
    setHolat("");
    setPage(1);
  }

  return (
    <Box>
      {/* HEADER */}
      <Flex align="center" gap={3} mb={6} mt={0}>
        <Circle mt={6} size="40px" bg="primaryBg">
          <Icon as={Users} color="primary" boxSize={5} />
        </Circle>
        <Box>
          <Text fontSize="xl" fontWeight="700" color="text">
            {t("hodim.hodim.hodimlar")}
          </Text>
          <Text fontSize="xs" color="textSecondary">
            {t("hodim.hodim.hodimlarningumumiyishholati")}
          </Text>
        </Box>
      </Flex>

      <Box mb={5} mr={6}>
        <Flex gap={3} w="100%">
          {[
            {
              label: t("hodim.hodim.info.ahodimlar"),
              val: aktivCount,
              color: "green.400",
            },
            {
              label: t("hodim.hodim.info.nhodim"),
              val: nofaolCount,
              color: "red.400",
            },
            {
              label: t("hodim.hodim.info.jhodim"),
              val: jamiCount,
              color: "blue.400",
            },
          ].map((p, i) => (
            <Box
              key={i}
              flex="1"
              bg="whiteAlpha.50"
              border="1px solid"
              borderColor="border"
              borderRadius="10px"
              px={4}
              py={3}
            >
              <Flex align="center" gap={3}>
                <Box w="8px" h="8px" borderRadius="full" bg={p.color} />
                <Box>
                  <Text
                    fontFamily="mono"
                    fontSize="18px"
                    fontWeight="700"
                    color={p.color}
                    lineHeight="1"
                  >
                    {p.val}
                  </Text>
                  <Text fontSize="11px" color="gray.500" mt="2px">
                    {p.label}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </Flex>
      </Box>

      {/* FILTER  */}
      <Flex
        mr={6}
        gap={3}
        mb={5}
        flexWrap="wrap"
        alignItems="center"
        bg="whiteAlpha.50"
        border="1px solid"
        borderColor="border"
        borderRadius="12px"
        justifyContent={"space-between"}
        p={3}
      >
        {/* SEARCH */}
        <InputGroup
          maxW="280px"
          bg="whiteAlpha.50"
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="10px"
          _focusWithin={{
            borderColor: "blue.400",
            boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
          }}
        >
          <InputLeftElement pointerEvents="none">
            <Icon as={Search} color="gray.400" boxSize={4} />
          </InputLeftElement>

          <Input
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg="transparent"
            border="none"
            color="white"
            pl="36px"
            _placeholder={{ color: "gray.500" }}
            _focus={{ boxShadow: "none" }}
            fontSize="13px"
          />
        </InputGroup>

        {/* HUDUD */}
        <Select
          maxW="200px"
          value={hudud}
          onChange={(e) => {
            setHudud(e.target.value);
            setMahalla("");
          }}
          bg="whiteAlpha.50"
          border="1px solid"
          borderColor="border"
          _focus={{ borderColor: "blue.500" }}
          fontSize="13px"
        >
          <option value="">{t("hodim.hodim.barchahududlar")}</option>
          {HUDUDLAR.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </Select>

        {/* MAHALLA */}
        <Select
          maxW="200px"
          value={mahalla}
          onChange={(e) => setMahalla(e.target.value)}
          isDisabled={!hudud}
          bg="whiteAlpha.50"
          border="1px solid"
          borderColor="border"
          _focus={{ borderColor: "blue.500" }}
          fontSize="13px"
        >
          <option value="">{t("hodim.hodim.barcha.mahallalar")}</option>
          {mahallalar.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>

        {/* HOLAT */}
        <Select
          maxW="160px"
          value={holat}
          onChange={(e) => setHolat(e.target.value)}
          bg="whiteAlpha.50"
          border="1px solid"
          borderColor="border"
          _focus={{ borderColor: "blue.500" }}
          fontSize="13px"
        >
          <option value="">{t("hodim.hodim.barcha.holat")}</option>
          <option value="aktiv">{t("hodim.hodim.aktiv")}</option>
          <option value="nofaol">{t("hodim.hodim.nofaol")}</option>
        </Select>

        {/* Clear Filter */}
        <IconButton icon={<Trash2 />} onClick={clearFilter} />
      </Flex>

      {/* JADVAL */}
      <Box
        mr={6}
        bg="whiteAlpha.50"
        border="1px solid"
        borderColor="border"
        borderRadius="12px"
        overflow="hidden"
      >
        <Table size="sm">
          <Thead>
            <Tr
              bg="whiteAlpha.100"
              borderBottom="1px solid"
              borderColor="border"
            >
              {[
                "#",
                t("hodim.hodim.jadval.hodim"),
                t("hodim.hodim.jadval.hudud"),
                t("hodim.hodim.jadval.holat"),
              ].map((h, i) => (
                <Th
                  key={i}
                  py={3}
                  px={4}
                  fontSize="10px"
                  fontWeight="600"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing=".5px"
                >
                  {h}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {hodimlar.map((h, idx) => (
              <React.Fragment key={h.id}>
                <Tr
                  key={h.id}
                  opacity={h.aktiv ? 1 : 0.55}
                  borderBottom="1px solid"
                  borderColor="border"
                  _hover={{ bg: "whiteAlpha.100" }}
                  transition="background .15s"
                  cursor="pointer"
                >
                  <Td px={4} py={3}>
                    <Text fontFamily="mono" fontSize="12px" color="gray.500">
                      {String((page - 1) * limit + idx + 1).padStart(2, "0")}
                    </Text>
                  </Td>

                  {/* Hodim */}
                  <Td px={4} py={3}>
                    <Flex align="center" gap={3}>
                      <Box>
                        <Text fontSize="13px" fontWeight="500" color="text">
                          {h.ism}
                        </Text>
                        <Text
                          fontSize="11px"
                          color="gray.500"
                          fontFamily="mono"
                        >
                          {h.telefon}
                        </Text>
                      </Box>
                    </Flex>
                  </Td>

                  {/* Hudud */}
                  <Td px={4} py={3}>
                    <Badge
                      bg="#1a365dcc"
                      color="blue.300"
                      borderRadius="6px"
                      px={2}
                      py={1}
                      fontSize="11px"
                      fontWeight="500"
                    >
                      {h.hudud}
                    </Badge>
                  </Td>

                  {/* Holat */}
                  <Td px={4} py={3}>
                    <Badge
                      bg={h.aktiv ? "#1c4532b9" : "red.900"}
                      color={h.aktiv ? "green.300" : "red.300"}
                      borderRadius="20px"
                      px={3}
                      py={1}
                      fontSize="11px"
                    >
                      ●{" "}
                      {h.aktiv
                        ? t("hodim.hodim.aktiv")
                        : t("hodim.hodim.nofaol")}
                    </Badge>
                  </Td>
                </Tr>
              </React.Fragment>
            ))}
          </Tbody>
        </Table>

        {hodimlar.length === 0 && (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={16}
            gap={2}
          >
            <Icon as={Users} boxSize={10} color="gray.600" />
            <Text color="gray.500" fontSize="14px">
              {t("hodim.hodim.natijatopilmadi")}
            </Text>
          </Flex>
        )}
      </Box>
      {hodimlar.length > 0 && (
        <Flex justify="center" mb={6} mt={6} gap={3}>
          <Button
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            isDisabled={page === 1}
          >
            ← {t("inspection.prev")}
          </Button>

          <Text fontSize="sm">
            {meta.page} / {meta.totalPages}
          </Text>

          <Button
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            isDisabled={page === meta.totalPages}
          >
            {t("inspection.next")} →
          </Button>
        </Flex>
      )}
    </Box>
  );
}
