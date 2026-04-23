import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
    Avatar, Box, Button, Divider, Flex,
    Icon, IconButton, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalContent,
    ModalFooter, ModalHeader, ModalOverlay,
    Text, useDisclosure,
} from "@chakra-ui/react"
import { ArrowLeft, KeyRound, EyeOff, Eye, Pencil } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Requests } from "../../../Services/api/Requests"
import { toastService } from "../../../utils/toast"
import Cookies from "js-cookie"

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

export default function JekProfile() {
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [editFirst, setEditFirst] = useState("")
    const [editLast, setEditLast] = useState("")
    const [editPhone, setEditPhone] = useState("")
    const currentRole = Cookies.get("role")
    const { id } = useParams()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [hodim, setHodim] = useState(null)
    const [loading, setLoading] = useState(true)
    const [btnLoading, setBtnLoading] = useState(false)

    const { isOpen: isPasswordOpen, onOpen: openPassword, onClose: closePassword } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure()

    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const fetchHodim = async () => {
        setLoading(true)
        try {
            const res = await Requests.getSelfData()
            setHodim(res.data)
        } catch {
            toastService.error(t("profile.profile.fetch_error"))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchHodim() }, [id])

    const withLoad = async (fn) => {
        setBtnLoading(true)
        try { await fn() } finally { setBtnLoading(false) }
    }

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
            <Text fontSize="13px" color="gray.600">{t("profile.profile.loading")}</Text>
        </Flex>
    )

    return (
        <Box maxW="560px" mx="auto" py={8} px={4}>

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
                {t("profile.profile.back")}
            </Button>

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
                </Box>
            </Flex>

            <Box mb={6}>
                <Text fontSize="10px" fontWeight="600" color="gray.600"
                    textTransform="uppercase" letterSpacing="1px" mb={1}>
                    {t("profile.profile.info")}
                </Text>
                <Box bg="whiteAlpha.50" border="1px solid" borderColor="border"
                    borderRadius="12px" px={4}>
                    <Row label={t("profile.profile.first_name")} value={hodim?.data?.first_name} />
                    <Divider borderColor="border" />
                    <Row label={t("profile.profile.last_name")} value={hodim?.data?.last_name} />
                    <Divider borderColor="border" />
                    <Row label={t("profile.profile.phone")} value={`+${hodim?.data?.phoneNumber}`} />
                </Box>
            </Box>

            {currentRole === "JEK" && (
                <Box mb={6}>
                    <Flex justify="start" align="center" mb={1}>
                        <Text fontSize="10px" fontWeight="600" color="gray.600"
                            textTransform="uppercase" letterSpacing="1px">
                            {t("profile.profile.addresses")}
                        </Text>
                    </Flex>
                    <Box bg="whiteAlpha.50" border="1px solid" borderColor="border"
                        borderRadius="12px" px={4}>
                        {hodim?.data?.addresses?.length > 0 ? (
                            hodim.data.addresses.map((a, i) => (
                                <Flex key={a.id || i} justify="start" align="center"
                                    py={3} borderBottom="1px solid" borderColor="border"
                                    _last={{ borderBottom: "none" }}>
                                    <Box>
                                        <Text fontSize="13px" fontWeight="500" color="text">
                                            {a.district}
                                        </Text>
                                        <Text fontSize="12px" color="gray.500" mt="1px">
                                            {a.neighborhood}
                                        </Text>
                                    </Box>
                                </Flex>
                            ))
                        ) : (
                            <Flex justify="space-between" align="center" py={3}>
                                <Text fontSize="12px" color="gray.600">{t("profile.profile.no_address_jek")}</Text>
                            </Flex>
                        )}
                    </Box>
                </Box>
            )}

            <Box>
                <Text fontSize="10px" fontWeight="600" color="gray.600"
                    textTransform="uppercase" letterSpacing="1px" mb={1}>
                    {t("profile.profile.actions")}
                </Text>
                <Box bg="whiteAlpha.50" border="1px solid" borderColor="border"
                    borderRadius="12px" px={2} py={2}>
                    <Flex direction="column">
                        <ActionBtn
                            icon={Pencil}
                            label={t("profile.profile.edit_profile")}
                            colorScheme="blue"
                            onClick={() => {
                                setEditFirst(hodim?.data?.first_name || "")
                                setEditLast(hodim?.data?.last_name || "")
                                setEditPhone(hodim?.data?.phoneNumber || "")
                                openEdit()
                            }}
                        />
                        <Divider borderColor="border" />
                        <ActionBtn
                            icon={KeyRound}
                            label={t("profile.profile.change_password")}
                            colorScheme="yellow"
                            onClick={openPassword}
                        />
                    </Flex>
                </Box>
            </Box>

            {/* PAROL MODAL */}
            <Modal isOpen={isPasswordOpen} onClose={closePassword} isCentered size="sm">
                <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
                <ModalContent border="1px solid" borderColor="border" borderRadius="16px">
                    <ModalHeader fontSize="15px" fontWeight="600" color="text">
                        {t("profile.profile.password_title")}
                    </ModalHeader>
                    <ModalBody display="flex" flexDir="column" gap={3}>
                        <Flex align="center" position="relative">
                            <InputGroup size="sm">
                                <Input
                                    type={show ? "text" : "password"}
                                    placeholder={t("profile.profile.password_placeholder")}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    bg="whiteAlpha.50" border="1px solid"
                                    borderColor="border" fontSize="13px"
                                    size="sm" borderRadius="8px"
                                    pr="36px"
                                    _focus={{ borderColor: "blue.500" }}
                                />
                                <InputRightElement>
                                    <IconButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShow(!show)}
                                        icon={show ? <EyeOff size={16} /> : <Eye size={16} />}
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </Flex>
                        <Flex align="center" position="relative">
                            <InputGroup size="sm">
                                <Input
                                    type={show2 ? "text" : "password"}
                                    placeholder={t("profile.profile.confirm_placeholder")}
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    bg="whiteAlpha.50" border="1px solid"
                                    borderColor="border" fontSize="13px"
                                    size="sm" borderRadius="8px"
                                    pr="36px"
                                    _focus={{ borderColor: "blue.500" }}
                                />
                                <InputRightElement>
                                    <IconButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShow2(!show2)}
                                        icon={show2 ? <EyeOff size={16} /> : <Eye size={16} />}
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </Flex>
                        {confirmPassword && newPassword !== confirmPassword && (
                            <Text fontSize="11px" color="red.400">{t("profile.profile.password_mismatch")}</Text>
                        )}
                    </ModalBody>
                    <ModalFooter gap={2} pt={2}>
                        <Button flex={1} variant="ghost" size="sm" color="gray.500" onClick={closePassword}>
                            {t("profile.profile.cancel")}
                        </Button>
                        <Button flex={1} size="sm" bg="blue.500" color="text"
                            isDisabled={newPassword.length < 8 || newPassword !== confirmPassword}
                            isLoading={btnLoading} onClick={handlePassword}>
                            {t("profile.profile.save")}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* TAHRIRLASH MODAL */}
            <Modal isOpen={isEditOpen} onClose={closeEdit} isCentered size="sm">
                <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
                <ModalContent border="1px solid" borderColor="border" borderRadius="16px">
                    <ModalHeader fontSize="15px" fontWeight="600" color="text">
                        {t("profile.profile.edit_title")}
                    </ModalHeader>
                    <ModalBody display="flex" flexDir="column" gap={3}>
                        <Input
                            placeholder={t("profile.profile.first_name_placeholder")}
                            value={editFirst}
                            onChange={e => setEditFirst(e.target.value)}
                            bg="whiteAlpha.50" border="1px solid"
                            borderColor="border" fontSize="13px"
                            size="sm" borderRadius="8px"
                            _focus={{ borderColor: "blue.500" }}
                        />
                        <Input
                            placeholder={t("profile.profile.last_name_placeholder")}
                            value={editLast}
                            onChange={e => setEditLast(e.target.value)}
                            bg="whiteAlpha.50" border="1px solid"
                            borderColor="border" fontSize="13px"
                            size="sm" borderRadius="8px"
                            _focus={{ borderColor: "blue.500" }}
                        />
                        <Input
                            placeholder={t("profile.profile.phone_placeholder")}
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
                            {t("profile.profile.cancel")}
                        </Button>
                        <Button flex={1} size="sm" bg="blue.500" color="text"
                            isDisabled={!editFirst || !editLast || !editPhone}
                            isLoading={btnLoading}
                            onClick={handleEdit}>
                            {t("profile.profile.save")}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </Box>
    )
}