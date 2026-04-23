import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Avatar, Badge, Box, Button, Divider, Flex,
  Icon, Input, Modal, ModalBody, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay, Select,
  Text, useDisclosure,
} from "@chakra-ui/react"
import { ArrowLeft, Lock, LockOpen, KeyRound, EyeOff, Eye, Pencil } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Requests } from "../../Services/api/Requests"
import { toastService } from "../../utils/toast"
import destination from "../../constants/mahallas.json"
import Cookies from "js-cookie"
// ---- kichik yordamchi komponent ----
function Row({ label, value }) {
  return (
    <Flex justify="space-between" align="center" py={3}
      borderBottom="1px solid" borderColor="whiteAlpha.100">
      <Text fontSize="12px" color="gray.500">{label}</Text>
      <Text fontSize="13px" fontWeight="500" color="text">{value || "—"}</Text>
    </Flex>
  )
}

function ActionBtn({ icon, label, colorScheme, onClick }) {
  return (
    <Button
      leftIcon={<Icon as={icon} boxSize={4} />}
      size="sm"
      variant="ghost"
      colorScheme={colorScheme}
      onClick={onClick}
      px={4}
      fontWeight="500"
      fontSize="13px"
    >
      {label}
    </Button>
  )
}

export default function Profile() {
  const [editFirst, setEditFirst] = useState("")
  const [editLast, setEditLast] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const currentRole = Cookies.get("role")
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [removeAddressId, setRemoveAddressId] = useState(null)
  const [hodim, setHodim] = useState(null)
  const [loading, setLoading] = useState(true)
  const [btnLoading, setBtnLoading] = useState(false)
  const [removeAddress, setRemoveAddress] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Modals
  const { isOpen: isBlockOpen, onOpen: openBlock, onClose: closeBlock } = useDisclosure()
  const { isOpen: isRemoveOpen, onOpen: openRemove, onClose: closeRemove } = useDisclosure()
  const { isOpen: isAddressOpen, onOpen: openAddress, onClose: closeAddress } = useDisclosure()
  const { isOpen: isPasswordOpen, onOpen: openPassword, onClose: closePassword } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure()

  // Address state
  const HUDUDLAR = destination.uz.addresses
  const [modalHudud, setModalHudud] = useState("")
  const [modalMahalla, setModalMahalla] = useState("")
  const modalMahallalar = modalHudud ? destination?.uz?.mahallas?.[modalHudud] || [] : []

  // Password state
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const fetchHodim = async () => {
    setLoading(true)
    try {
      const res = await Requests.getUserInfo(id)
      setHodim(res.data)
    } catch {
      toastService.error("Ma'lumot olishda xatolik")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchHodim() }, [id])

  const withLoad = async (fn) => {
    setBtnLoading(true)
    try { await fn() } finally { setBtnLoading(false) }
  }

  const handleBlock = () => withLoad(async () => {
    const res = await Requests.updateStatus({ id, isActive: !hodim?.data?.isActive })
    toastService.success(hodim?.data?.isActive ? "Hodim bloklandi" : "Hodim faollashtirildi")
    await fetchHodim()
    closeBlock()
  })

  const handleRemove = () => withLoad(async () => {
    const res = await Requests.removeAddress(id, removeAddressId)
    toastService.success(res.data.message)
    await fetchHodim()
    closeRemove()
  })

  const handleAssign = () => withLoad(async () => {
    const res = await Requests.assignAddress(id, modalHudud, modalMahalla)
    toastService.success(res.data.message)
    await fetchHodim()
    closeAddress()
  })

  const handlePassword = () => withLoad(async () => {
    const res = await Requests.changePassword(id, newPassword, confirmPassword)
    toastService.success(res.data.message)
    setNewPassword("")
    setConfirmPassword("")
    closePassword()
  })

  const handleEdit = () => withLoad(async () => {
    const res = await Requests.updateProfile(id, editFirst, editLast, editPhone)
    toastService.success(res.data.message)
    await fetchHodim()
    closeEdit()
  })

  if (loading) return (
    <Flex h="60vh" align="center" justify="center">
      <Text fontSize="13px" color="gray.600">Yuklanmoqda...</Text>
    </Flex>
  )

  return (
    <Box maxW="560px" mx="auto" py={8} px={4}>

      {/* BACK */}
      <Button
        leftIcon={<ArrowLeft size={15} />}
        variant="ghost"
        size="sm"
        color="gray.500"
        mb={8}
        px={0}
        _hover={{ color: "text", bg: "transparent" }}
        onClick={() => navigate(-1)}
      >
        Orqaga
      </Button>

      {/* AVATAR + ISM */}
      <Flex align="center" gap={4} mb={8}>
        <Avatar
          size="lg"
          name={`${hodim?.data?.first_name} ${hodim?.data?.last_name}`}
          borderRadius="14px"
        />
        <Box>
          <Text fontSize="18px" fontWeight="600" color="text" lineHeight="1.2">
            {hodim?.data?.first_name} {hodim?.data?.last_name}
          </Text>
          <Text fontSize="12px" color="gray.500" fontFamily="mono" mt={1}>
            +{hodim?.data?.phoneNumber}
          </Text>
          <Badge
            mt={2}
            bg={hodim?.data?.isActive ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)"}
            color={hodim?.data?.isActive ? "green.400" : "red.400"}
            borderRadius="20px"
            px={3} py="2px"
            fontSize="10px"
            fontWeight="500"
          >
            ● {hodim?.data?.isActive ? "Aktiv" : "Nofaol"}
          </Badge>
        </Box>
      </Flex>

      {/* MA'LUMOTLAR */}
      <Box mb={6}>
        <Text fontSize="10px" fontWeight="600" color="gray.600"
          textTransform="uppercase" letterSpacing="1px" mb={1}>
          Ma'lumotlar
        </Text>
        <Box bg="whiteAlpha.50" border="1px solid" borderColor="border"
          borderRadius="12px" px={4}>
          <Row label="Ism" value={hodim?.data?.first_name} />
          <Divider borderColor="border" />
          <Row label="Familiya" value={hodim?.data?.last_name} />
          <Divider borderColor="border" />
          <Row label="Telefon" value={`+${hodim?.data?.phoneNumber}`} />
        </Box>
      </Box>


      {/* MANZIL */}
      {currentRole === "INSPECTION" && (
        <Box mb={6}>
          <Flex justify="space-between" align="center" mb={1}>
            <Text fontSize="10px" fontWeight="600" color="gray.600"
              textTransform="uppercase" letterSpacing="1px">
              Manzillar
            </Text>
            <Button size="xs" variant="ghost" colorScheme="blue" onClick={openAddress}>
              + Qo'shish
            </Button>
          </Flex>
          <Box bg="whiteAlpha.50" border="1px solid" borderColor="border"
            borderRadius="12px" px={4}>
            {hodim?.data?.addresses?.length > 0 ? (
              hodim.data.addresses.map((a, i) => (
                <Flex key={a.address?.id || i} justify="space-between" align="center"
                  py={3} borderBottom="1px solid" borderColor="border"
                  _last={{ borderBottom: "none" }}>
                  <Box>
                    <Text fontSize="13px" fontWeight="500" color="text">
                      {a.address?.district}
                    </Text>
                    <Text fontSize="12px" color="gray.500" mt="1px">
                      {a.address?.neighborhood}
                    </Text>
                  </Box>
                  <Button size="xs" variant="ghost" colorScheme="red"
                    onClick={() => {
                      console.log("address:", a)
                      setRemoveAddressId(a.address?.id)
                      setRemoveAddress(a.address)
                      openRemove()
                    }}>
                    O'chirish
                  </Button>
                </Flex>
              ))
            ) : (
              <Flex justify="space-between" align="center" py={3}>
                <Text fontSize="12px" color="gray.600">Manzil biriktirilmagan</Text>
              </Flex>
            )}
          </Box>
        </Box>
      )}

      {/* AMALLAR */}
      <Box>
        <Text fontSize="10px" fontWeight="600" color="gray.600"
          textTransform="uppercase" letterSpacing="1px" mb={1}>
          Amallar
        </Text>
        <Box bg="whiteAlpha.50" border="1px solid" borderColor="border"
          borderRadius="12px" px={2} py={2}>
          <Flex direction="column">
            <ActionBtn
              icon={Pencil}
              label="Ma'lumotlarni tahrirlash"
              colorScheme="blue"
              onClick={() => {
                setEditFirst(hodim?.data?.first_name || "")
                setEditLast(hodim?.data?.last_name || "")
                setEditPhone(hodim?.data?.phoneNumber || "")
                openEdit()
              }} />
            <Divider borderColor="border" />
            <ActionBtn
              icon={hodim?.data?.isActive ? Lock : LockOpen}
              label={hodim?.data?.isActive ? "Bloklash" : "Faollashtirish"}
              colorScheme={hodim?.data?.isActive ? "red" : "green"}
              onClick={openBlock}
            />
            <Divider borderColor="border" />
            <ActionBtn
              icon={KeyRound}
              label="Parolni o'zgartirish"
              colorScheme="yellow"
              onClick={openPassword}
            />
          </Flex>
        </Box>
      </Box>

      {/* ===== MODALLAR ===== */}

      {/* BLOKLASH */}
      <Modal isOpen={isBlockOpen} onClose={closeBlock} isCentered size="sm">
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
        <ModalContent border="1px solid" borderColor="border" borderRadius="16px">
          <ModalHeader>
            {hodim?.data?.isActive ? "Hodimni bloklash" : "Hodimni faollashtirish"}
          </ModalHeader>
          <ModalBody>
            <Text fontSize="13px" color="gray.400">
              {hodim?.data?.isActive
                ? "Bu hodim tizimga kira olmay qoladi."
                : "Bu hodim tizimga qayta kira oladi."
              }
            </Text>
          </ModalBody>
          <ModalFooter gap={2} pt={2}>
            <Button flex={1} variant="ghost" size="sm" color="gray.500" onClick={closeBlock}>
              Bekor
            </Button>
            <Button flex={1} size="sm"
              bg={hodim?.data?.isActive ? "red.500" : "green.500"}
              color="text"
              isLoading={btnLoading}
              onClick={handleBlock}>
              {hodim?.data?.isActive ? "Bloklash" : "Faollashtirish"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* MANZIL O'CHIRISH */}
      <Modal isOpen={isRemoveOpen} onClose={closeRemove} isCentered size="sm">
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
        <ModalContent border="1px solid" borderColor="border" borderRadius="16px">
          <ModalHeader fontSize="15px" fontWeight="600" color="text">
            Manzilni o'chirish
          </ModalHeader>
          <ModalBody>
            <Text fontSize="13px" color="gray.400">
              <b>{removeAddress?.district}</b> — {removeAddress?.neighborhood} manzili o'chiriladi.
            </Text>
          </ModalBody>
          <ModalFooter gap={2} pt={2}>
            <Button flex={1} variant="ghost" size="sm" color="gray.500" onClick={closeRemove}>
              Bekor
            </Button>
            <Button flex={1} size="sm" bg="red.500" color="text"
              isLoading={btnLoading} onClick={handleRemove}>
              O'chirish
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* MANZIL BIRIKTIRISH */}
      <Modal isOpen={isAddressOpen} onClose={closeAddress} isCentered size="sm">
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
        <ModalContent border="1px solid" borderColor="border" borderRadius="16px">
          <ModalHeader fontSize="15px" fontWeight="600" color="text">
            Manzil biriktirish
          </ModalHeader>
          <ModalBody display="flex" flexDir="column" gap={3}>
            <Select value={modalHudud}
              onChange={e => { setModalHudud(e.target.value); setModalMahalla("") }}
              bg="whiteAlpha.50" border="1px solid" borderColor="border"
              fontSize="13px" size="sm" borderRadius="8px">
              <option value="">Hudud tanlang</option>
              {HUDUDLAR.map(h => <option key={h} value={h}>{h}</option>)}
            </Select>
            <Select value={modalMahalla}
              onChange={e => setModalMahalla(e.target.value)}
              isDisabled={!modalHudud}
              bg="whiteAlpha.50" border="1px solid" borderColor="border"
              fontSize="13px" size="sm" borderRadius="8px">
              <option value="">Mahalla tanlang</option>
              {modalMahallalar.map(m => <option key={m} value={m}>{m}</option>)}
            </Select>
          </ModalBody>
          <ModalFooter gap={2} pt={2}>
            <Button flex={1} variant="ghost" size="sm" color="gray.500" onClick={closeAddress}>
              Bekor
            </Button>
            <Button flex={1} size="sm" bg="blue.500" color="text"
              isDisabled={!modalHudud || !modalMahalla}
              isLoading={btnLoading} onClick={handleAssign}>
              Saqlash
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* PAROL */}
      <Modal isOpen={isPasswordOpen} onClose={closePassword} isCentered size="sm">
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
        <ModalContent border="1px solid" borderColor="border" borderRadius="16px">
          <ModalHeader fontSize="15px" fontWeight="600" color="text">
            Parolni o'zgartirish
          </ModalHeader>
          <ModalBody display="flex" flexDir="column" gap={3}>
            <Flex align="center" position="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Yangi parol (min 8 belgi)"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                bg="whiteAlpha.50" border="1px solid"
                borderColor="border" fontSize="13px"
                size="sm" borderRadius="8px"
                pr="36px"
                _focus={{ borderColor: "blue.500" }}
              />
              <Box position="absolute" right={3} cursor="pointer"
                color="gray.500" onClick={() => setShowPassword(p => !p)}>
                <Icon as={showPassword ? EyeOff : Eye} boxSize={4} />
              </Box>
            </Flex>

            <Flex align="center" position="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="Parolni tasdiqlang"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                bg="whiteAlpha.50" border="1px solid"
                borderColor="border" fontSize="13px"
                size="sm" borderRadius="8px"
                pr="36px"
                _focus={{ borderColor: "blue.500" }}
              />
              <Box position="absolute" right={3} cursor="pointer"
                color="gray.500" onClick={() => setShowConfirm(p => !p)}>
                <Icon as={showConfirm ? EyeOff : Eye} boxSize={4} />
              </Box>
            </Flex>

            {confirmPassword && newPassword !== confirmPassword && (
              <Text fontSize="11px" color="red.400">Parollar mos emas</Text>
            )}
          </ModalBody>
          <ModalFooter gap={2} pt={2}>
            <Button flex={1} variant="ghost" size="sm" color="gray.500" onClick={closePassword}>
              Bekor
            </Button>
            <Button flex={1} size="sm" bg="blue.500" color="text"
              isDisabled={newPassword.length < 8 || newPassword !== confirmPassword}
              isLoading={btnLoading} onClick={handlePassword}>
              Saqlash
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* TAHRIRLASH MODAL */}
      <Modal isOpen={isEditOpen} onClose={closeEdit} isCentered size="sm">
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
        <ModalContent border="1px solid" borderColor="border" borderRadius="16px">
          <ModalHeader fontSize="15px" fontWeight="600" color="text">
            Ma'lumotlarni tahrirlash
          </ModalHeader>
          <ModalBody display="flex" flexDir="column" gap={3}>
            <Input
              placeholder="Ism"
              value={editFirst}
              onChange={e => setEditFirst(e.target.value)}
              bg="whiteAlpha.50" border="1px solid"
              borderColor="border" fontSize="13px"
              size="sm" borderRadius="8px"
              _focus={{ borderColor: "blue.500" }}
            />
            <Input
              placeholder="Familiya"
              value={editLast}
              onChange={e => setEditLast(e.target.value)}
              bg="whiteAlpha.50" border="1px solid"
              borderColor="border" fontSize="13px"
              size="sm" borderRadius="8px"
              _focus={{ borderColor: "blue.500" }}
            />
            <Input
              placeholder="Telefon (+998...)"
              value={editPhone}
              onChange={e => setEditPhone(e.target.value)}
              bg="whiteAlpha.50" border="1px solid"
              borderColor="border" fontSize="13px"
              size="sm" borderRadius="8px"
              _focus={{ borderColor: "blue.500" }}
            />
          </ModalBody>
          <ModalFooter gap={2} pt={2}>
            <Button flex={1} variant="ghost" size="sm" color="gray.500" onClick={closeEdit}>
              Bekor
            </Button>
            <Button flex={1} size="sm" bg="blue.500" color="text"
              isDisabled={!editFirst || !editLast || !editPhone}
              isLoading={btnLoading}
              onClick={handleEdit}>
              Saqlash
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  )
}