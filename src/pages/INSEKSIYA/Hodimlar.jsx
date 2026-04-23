import React, { useState, useEffect, } from "react";
import { Avatar, Badge, Box, Button, Circle, Flex, Icon, IconButton, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Switch, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, } from "@chakra-ui/react";
import { Pen, PenOff, Search, Trash2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import destination from "../../constants/mahallas.json";
import { Requests } from "../../Services/api/Requests";
import { toastService } from "../../utils/toast";
import { useNavigate } from "react-router";

export default function Hodimlari() {
  const navigate = useNavigate()
  const [hodimlar, setHodimlar] = useState([]);
  const { t } = useTranslation();
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
      const res = await Requests.getEmploye({ role: "JEK", page });
      const mapped = res.data.data.map((i) => ({
        id: i.id,
        ism: i.first_name,
        familiya: i.last_name,
        telefon: "+" + i.phoneNumber,
        hudud: i.addresses?.[0]?.address?.district,
        hudud2: i.addresses?.[1]?.address?.district,
        mahalla: i.addresses?.[0]?.address?.neighborhood,
        addressId: i.addresses?.[0]?.address_id,
        aktiv: i.isActive,
        bajarilgan: 0,
        sana: "-",
      }))
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

  function clearFilter() {
    setSearch("")
    setHudud("")
    setMahalla("")
    setHolat("")
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
            { label: t('hodim.hodim.info.ahodimlar'), val: aktivCount, color: "green.400" },
            { label: t('hodim.hodim.info.nhodim'), val: nofaolCount, color: "red.400" },
            { label: t('hodim.hodim.info.jhodim'), val: jamiCount, color: "blue.400" },
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
          placeholder="Mahalla"
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
        <IconButton
          icon={<Trash2 />}
          onClick={clearFilter}
        />
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
                t("hodim.hodim.jadval.hudud"),
                t("hodim.hodim.jadval.holat"),
                t("hodim.hodim.jadval.aktiv_nofaol"),
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
            {filtered.map((h, idx) => (
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

                  {/* Hudud */}
                  <Td px={4} py={3}>
                    {h.hudud2 ?
                      <>
                        <Badge
                          bg="#3f1a5dcc"
                          color="#d6c6e2cc"
                          borderRadius="6px"
                          px={2}
                          py={1}
                          fontSize="11px"
                          fontWeight="500"
                        >
                          {h.hudud2}
                        </Badge>
                      </> :
                      <>
                        <Badge
                          bg="#5d1a1acc"
                          color="#e2c6c6cc"
                          borderRadius="6px"
                          px={2}
                          py={1}
                          fontSize="11px"
                          fontWeight="500"
                        >
                          2-manzil mavjud emas
                        </Badge>
                      </>}
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
                      ● {h.aktiv ? t('hodim.hodim.aktiv') : t('hodim.hodim.nofaol')}
                    </Badge>
                  </Td>



                  {/* Toggle */}
                  <Td px={4} py={3}>
                    <Switch
                      isChecked={h.aktiv}
                      colorScheme="green"
                      onChange={() => handleToggleClick(h)}
                    />
                  </Td>
                  <Td px={4} py={3}>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      onClick={() => navigate(`/inseksiya/profile/${h.id}`)}
                    >
                      Ko'rish →
                    </Button>
                  </Td>
                </Tr>
              </React.Fragment>
            ))}
          </Tbody>
        </Table>

        {filtered.length === 0 && (
          <Flex direction="column" align="center" justify="center" py={16} gap={2}>
            <Icon as={Users} boxSize={10} color="gray.600" />
            <Text color="gray.500" fontSize="14px">
              {t("hodim.hodim.natijatopilmadi")}
            </Text>
          </Flex>
        )}

      </Box>
      {filtered.length > 0 && (
        <Flex justify="center" mt={6} gap={3}>
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

      {/* TASDIQLASH MODAL */}
      <Modal isOpen={isModalOpen} onClose={closeModal} isCentered size="sm">
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
        <ModalContent
          // bg="gray.900"
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
                bg={pendingToggle?.aktiv ? "#E53E3Eb9" : "#38A169b9"}
              >
                {pendingToggle?.aktiv ? "🔒" : "🔓"}
              </Box>
              <Text fontSize="16px" fontWeight="600" color="text">
                {pendingToggle?.aktiv
                  ? t("hodim.hodim.modal.disable_title")
                  : t("hodim.hodim.modal.enable_title")}
              </Text>
            </Flex>
          </ModalHeader>
          <ModalBody py={4}>
            <Text fontSize="13px" color="text" mb={4} lineHeight="1.6">
              {pendingToggle?.aktiv
                ? t("hodim.hodim.modal.disable_text")
                : t("hodim.hodim.modal.enable_text")}
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
                name={`${pendingToggle?.ism} ${pendingToggle?.familiya}`}
                borderRadius="10px"
              // getInitials={() => pendingToggle?.initials}
              />
              <Box>
                <Text fontSize="14px" fontWeight="500" color="text">
                  {pendingToggle?.ism} {pendingToggle?.familiya}
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
              color="gray.500"
              _hover={{ bg: "whiteAlpha.100" }}
              onClick={closeModal}
            >
              {t("hodim.hodim.bekorqilish")}
            </Button>
            <Button
              flex={1}
              bg={pendingToggle?.aktiv ? "red.500" : "green.500"}
              color="white"
              _hover={{ opacity: 0.85 }}
              onClick={confirmToggle}
            >
              {pendingToggle?.aktiv ? t("hodim.hodim.nofaolqilish") : t("hodim.hodim.faol")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
