import { useState } from "react";
import { Avatar, Badge, Box, Button, Circle, Collapse, Flex, Icon, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Switch, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure,} from "@chakra-ui/react";
import { ChevronDown, ChevronUp, Search, Users } from "lucide-react";
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
        {t("hodim.bajarilgan")} / {t("hodim.jami")}
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

import { useEffect } from "react";
import { Requests } from "../../Services/api/Requests";
import { toastService } from "../../utils/toast";

export default function Hodimlari() {
  const [hodimlar, setHodimlar] = useState([]);
  const [infod, setIinfod] = useState([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [hudud, setHudud] = useState("");
  const [mahalla, setMahalla] = useState("");
  const HUDUDLAR = destination.uz.addresses;

  const mahallalar = hudud ? destination?.uz?.mahallas?.[hudud] || [] : [];

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const [search, setSearch] = useState("");
  const [holat, setHolat] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [pendingToggle, setPendingToggle] = useState(null);

  const filtered = hodimlar.filter((h) => {
    const q = search.toLowerCase();

    const matchSearch =
      h.ism.toLowerCase().includes(q) || h.telefon.includes(q);

    const matchHudud = !hudud || h.hudud === hudud;

    const matchMahalla = !mahalla || h.mahalla === mahalla;

    const matchHolat = !holat || (holat === "aktiv" ? h.aktiv : !h.aktiv);

    return matchSearch && matchHudud && matchMahalla && matchHolat;
  });

  const [page, setPage] = useState(1);
const [meta, setMeta] = useState({});
const limit = meta?.limit ?? 10;

  const fetchHodimlar = async () => {
    try {
      const res = await Requests.getEmploye({role:"JEK",   page});
      const mapped = res.data.data.map((i) => ({
        id: i.id,
        ism: i.first_name,
        
        familiya: i.last_name,
        telefon: "+" + i.phoneNumber,
        hudud: i.addresses?.[0]?.address?.district,
        mahalla: i.addresses?.[0]?.address?.neighborhood,
        aktiv: i.isActive,
        bajarilgan: 0,
        sana: "-",
      }));
      setHodimlar(mapped);
          setMeta(res.data.meta);
    } finally {
    }
  };

useEffect(() => {
  fetchHodimlar();
}, [page]);
const aktivCount = hodimlar.filter(h => h.aktiv).length;
const nofaolCount = hodimlar.length - aktivCount;
const jamiCount = meta.total || 0;

  function handleToggleClick(hodim) {
    setPendingToggle(hodim);
    openModal();
  }

  const confirmToggle = async () => {
    try {
      const newStatus = !pendingToggle.aktiv;
      const res = await Requests.updateStatus({
        id: pendingToggle.id,
        isActive: newStatus,
      });
      fetchHodimlar();

      closeModal();
      toastService.success(res.data.message);
    } finally {
      toastService.error(res.data.message);
    }
  };

  function toggleExpand(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  const hodimInfo = async (id) => {
    console.log(id);
    setLoading(true);
    try {
      const resi = await Requests.getUserInfo(id);
      setIinfod(resi?.data?.infod);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* HEADER */}
      <Flex align="center" gap={3} mb={6} mt={0}>
        <Circle mt={6} size="40px" bg="primaryBg">
          <Icon as={Users} color="primary" boxSize={5} />
        </Circle>
        <Box>
          <Text fontSize="xl" fontWeight="700" color="text">
            {t("hodim.hodimlar")}
          </Text>
          <Text fontSize="xs" color="textSecondary">
            {t("hodim.hodimlarningumumiyishholati")}
          </Text>
        </Box>
      </Flex>

      <Flex gap={3} mb={5} flexWrap="wrap">
        {[
          { label: "Aktiv hodimlar", val: aktivCount, color: "green.400" },
          { label: "Nofaol hodimlar", val: nofaolCount, color: "red.400" },
          { label: "Jami ro'yxatda", val: jamiCount, color: "blue.400" },
        ].map((p, i) => (
          <Flex
            key={i}
            align="center"
            gap={3}
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="border"
            borderRadius="10px"
            px={4}
            py={3}
          >
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
        ))}
      </Flex>

      {/* FILTER  */}
      <Flex
        mr={6}
        gap={3}
        mb={5}
        flexWrap="wrap"
        align="center"
        bg="whiteAlpha.50"
        border="1px solid"
        borderColor="border"
        borderRadius="12px"
        p={3}
      >
        {/* SEARCH */}
        <InputGroup maxW="280px">
          <InputLeftElement pointerEvents="none">
            <Icon as={Search} color="gray.500" boxSize={4} />
          </InputLeftElement>
          <Input
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg="transparent"
            border="none"
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
          <option value="">{t("hodim.barchahududlar")}</option>
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
          placeholder="Mahalla"
          isDisabled={!hudud}
          bg="whiteAlpha.50"
          border="1px solid"
          borderColor="border"
          _focus={{ borderColor: "blue.500" }}
          fontSize="13px"
        >
          <option value="">{t("hodim.barcha.mahallalar")}</option>
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
          <option value="">{t("hodim.barcha.holat")}</option>
          <option value="aktiv">{t("hodim.aktiv")}</option>
          <option value="nofaol">{t("hodim.nofaol")}</option>
        </Select>

        {/* COUNT */}
        <Flex ml="auto" align="center">
          <Text fontSize="12px" color="gray.500">
            {t("hodim.jami")}
          </Text>
          <Text fontSize="12px" fontWeight="600">
            {meta.total} {t("hodim.hodim")}
          </Text>
        </Flex>
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
                "Hodim",
                "Hudud",
                "Holat",
                "Bajarilgan",
                "Sana",
                "Aktiv/Nofaol",
                "",
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
              <>
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
                      bg="blue.900"
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
                      bg={h.aktiv ? "green.900" : "red.900"}
                      color={h.aktiv ? "green.300" : "red.300"}
                      borderRadius="20px"
                      px={3}
                      py={1}
                      fontSize="11px"
                    >
                      ● {h.aktiv ? "Aktiv" : "Nofaol"}
                    </Badge>
                  </Td>

                  {/* Bajarilgan */}
                  <Td px={4} py={3}>
                    <MiniBar value={h.bajarilgan} />
                  </Td>

                  {/* Sana */}
                  <Td px={4} py={3}>
                    <Text fontSize="12px" color="gray.500">
                      {h.sana}
                    </Text>
                  </Td>

                  {/* Toggle */}
                  <Td px={4} py={3}>
                    <Switch
                      isChecked={h.aktiv}
                      colorScheme="green"
                      onChange={() => handleToggleClick(h)}
                    />
                  </Td>

                  {/* Expand */}
                  <Td px={4} py={3}>
                    <Button
                      size="xs"
                      variant="ghost"
                      color="text"
                      _hover={{ bg: "whiteAlpha.100" }}
                      onClick={() => {
                        toggleExpand(h.id);
                        hodimInfo(h.id);
                      }}
                    >
                      <Icon
                        as={expandedId === h.id ? ChevronUp : ChevronDown}
                        boxSize={4}
                      />
                    </Button>
                  </Td>
                </Tr>

                {/* EXPAND qatori */}
                <Tr
                  key={`exp-${h.id}`}
                  borderBottom="1px solid"
                  borderColor="whiteAlpha.100"
                >
                  <Td colSpan={8} p={0}>
                    <Collapse in={expandedId === h.id} animateOpacity>
                      <Flex gap={4} p={4} bg="blackAlpha.100">
                        <Box
                          gap={6}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          bg={"blackAlpha.400"}
                          p={2}
                          borderRadius={"20px"}
                          w={"100%"}
                        >
                          <Flex
                            alignItems={"center"}
                            justifyContent={"start"}
                            gap={2}
                          >
                            <Avatar
                              size="md"
                              name={`${h.ism} ${h.familiya}`}
                              borderRadius="16px"
                            />
                            <Box>
                              <Text
                                fontSize="16px"
                                fontWeight="600"
                                color="text"
                                mb={1}
                              >
                                {h.ism} {h.familiya}
                              </Text>

                              <Text fontSize="12px" color="text">
                                {h.telefon}
                              </Text>
                            </Box>
                          </Flex>
                          <Flex gap={8} flexWrap="wrap">
                            <Box>
                              <Text fontSize="11px" color="gray.500" mb={1}>
                                Hudud
                              </Text>
                              <Text fontSize="13px" color="white">
                                {h.hudud || "-"}
                              </Text>
                            </Box>

                            <Box>
                              <Text fontSize="11px" color="gray.500" mb={1}>
                                Mahalla
                              </Text>
                              <Text fontSize="13px" color="white">
                                {h.mahalla || "-"}
                              </Text>
                            </Box>

                            <Box>
                              <Text fontSize="11px" color="gray.500" mb={1}>
                                Holat
                              </Text>
                              <Badge
                                bg={h.aktiv ? "green.900" : "red.900"}
                                color={h.aktiv ? "green.300" : "red.300"}
                                borderRadius="20px"
                                px={3}
                                py={1}
                                fontSize="11px"
                              >
                                {h.aktiv ? "Aktiv" : "Nofaol"}
                              </Badge>
                            </Box>

                            <Box>
                              <Text fontSize="11px" color="gray.500" mb={1}>
                                ID
                              </Text>
                              <Text
                                fontSize="11px"
                                color="gray.400"
                                fontFamily="mono"
                              >
                                {h.id}
                              </Text>
                            </Box>
                          </Flex>
                          <Flex align="center" ml="auto">
                            <EffRing
                              value={h.bajarilgan || 0}
                              color="green"
                              t={t}
                            />
                          </Flex>
                        </Box>
                      </Flex>
                    </Collapse>
                  </Td>
                </Tr>
              </>
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
              {t("hodim.natijatopilmadi")}
            </Text>
          </Flex>
        )}
      </Box>
      <Flex justify="center" mt={6} gap={3}>
  <Button
    size="sm"
    onClick={() => setPage((p) => p - 1)}
    isDisabled={page === 1}
  >
    Oldingi
  </Button>

  <Text fontSize="sm">
    {meta.page} / {meta.totalPages}
  </Text>

  <Button
    size="sm"
    onClick={() => setPage((p) => p + 1)}
    isDisabled={page === meta.totalPages}
  >
    Keyingi
  </Button>
</Flex>

      {/* TASDIQLASH MODAL */}
      <Modal isOpen={isModalOpen} onClose={closeModal} isCentered size="sm">
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
        <ModalContent
          bg="gray.900"
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="16px"
        >
          <ModalHeader pb={0}>
            <Flex align="center" gap={3}>
              <Box
                w="48px"
                h="48px"
                borderRadius="14px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="22px"
                bg={pendingToggle?.aktiv ? "red.900" : "green.900"}
              >
                {pendingToggle?.aktiv ? "🔒" : "🔓"}
              </Box>
              <Text fontSize="16px" fontWeight="600" color="white">
                {pendingToggle?.aktiv
                  ? t("hodim.modal.disable_title")
                  : t("hodim.modal.enable_title")}
              </Text>
            </Flex>
          </ModalHeader>
          <ModalBody py={4}>
            <Text fontSize="13px" color="gray.400" mb={4} lineHeight="1.6">
              {pendingToggle?.aktiv
                ? t("hodim.modal.disable_text")
                : t("hodim.modal.enable_text")}
            </Text>
            <Flex
              align="center"
              gap={3}
              bg="whiteAlpha.100"
              borderRadius="10px"
              p={3}
            >
              <Avatar
                size="sm"
                name={pendingToggle?.ism}
                borderRadius="10px"
                getInitials={() => pendingToggle?.initials}
              />
              <Box>
                <Text fontSize="14px" fontWeight="500" color="white">
                  {pendingToggle?.ism}
                </Text>
                <Text fontSize="12px" color="gray.500">
                  {pendingToggle?.hudud}
                </Text>
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter gap={3} pt={0}>
            <Button
              flex={1}
              variant="ghost"
              color="gray.400"
              _hover={{ bg: "whiteAlpha.100" }}
              onClick={closeModal}
            >
              {t("hodim.bekorqilish")}
            </Button>
            <Button
              flex={1}
              bg={pendingToggle?.aktiv ? "red.500" : "green.500"}
              color="white"
              _hover={{ opacity: 0.85 }}
              onClick={confirmToggle}
            >
              {pendingToggle?.aktiv ? "Nofaol qilish" : "Faollashtirish"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
