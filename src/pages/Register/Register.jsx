import {
    Box,
    Flex,
    Heading,
    Text,
    Input,
    Button,
    useColorMode,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Link,
    Select,
    Image,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Auth } from "../../Services/api/Auth";
import { useAuth } from "../../hooks/useAuth";
import { toastService } from "../../utils/toast";
// import { mahallas } from "../../Services/api/mahallas.json";
import { useNavigate } from "react-router";
import logo from "../../../public/logo2.png"
export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    // UI states
    const [loading, setLoading] = useState(false)

    const passInput = useRef("");
    const logInput = useRef("");
    const confirmPassword = useRef("");

    const [errors, setErrors] = useState({ login: "", password: "" });

    // ❗ Input o'zgarsa error avtomatik tozalanadi
    const clearError = (field) => {
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const loginText = logInput.current.value.trim();
        const password = passInput.current.value.trim();

        let newErrors = {};

        // Login validation
        if (!loginText) {
            newErrors.login = "Login kiritilmadi";
        }

        // Password validation
        if (!password) {
            newErrors.password = "Parol kiritilmadi";
        } else if (password.length < 6) {
            newErrors.password = "Parol kamida 6 belgidan iborat bo'lishi kerak";
        }

        setErrors(newErrors);

        // Agar hatolik bo'lsa API chaqirilmaydi
        if (Object.keys(newErrors).length > 0) return;


        try {
            const payload = {
                username: logInput.current.value,
                password: passInput.current.value
            }
            setLoading(true)
            const res = await Auth.Login(payload);
            if (res.status == 200 || res.status == 201) {
                const data = res.data
                login({
                    token: data.tokens.access_token,
                    refreshToken: data.tokens.refresh_token,
                    user: data.user
                }
                );
                if (data.user.role === "SUPER_ADMIN") {
                    navigate("/superadmin/admins");
                    toastService.success("Successfully, Welocome Boss !")
                } else {
                    toastService.error("Role mos kelmadi")
                }
            } else {
                toastService.error(res?.data?.message || "ok")
            }

        } catch (err) {

            if (err) { toastService.error(err?.response?.data?.message || "Tizim xatosi") }
        } finally {
            setLoading(false)
        }

    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg="bg" px={4}>
            {/* Dark/Light toggle button */}
            {/* <Button
                position="absolute"
                top="20px"
                right="20px"
                size="sm"
                onClick={toggleColorMode}
            >
                Tema
            </Button> */}
            <Box
                as="form"
                onSubmit={(e) => handleSubmit(e)}
                w={{ base: "100%", sm: "700px" }}
                bg="surface"
                p={8}
                rounded="xl"
                shadow="lg"
            >
                {/* Logo */}
                <Flex justify="center" mb={4}>
                    <Box
                        w="60px"
                        h="60px"
                        bg="white"
                        rounded="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="white"
                        fontWeight="bold"
                        fontSize="md"
                    >
                        <Image src={logo} alt=""/>
                    </Box>
                </Flex>

                {/* Title */}
                <Heading textAlign="center" size="lg" mb={2} color="text">
                    Registratsiya
                </Heading>

                {/* Subtitle */}
                <Text textAlign="center" color="gray.500" mb={6}>
                    Ma’lumotlarni kiriting!
                </Text>

                {/* Login input */}
                <FormControl mb={2} isInvalid={!!errors.login}>
                    <FormLabel color="text">Ism</FormLabel>
                    <Input
                        ref={logInput}
                        placeholder="Ismingizni kiriting"
                        onChange={() => clearError("login")}
                    />
                    <FormErrorMessage>{errors.login}</FormErrorMessage>
                </FormControl>
                <FormControl mb={2} isInvalid={!!errors.phone}>
                    <FormLabel color="text">Familya</FormLabel>
                    <Input
                        ref={logInput}
                        placeholder="Familyangizni kiriting"
                        onChange={() => clearError("phone")}
                    />
                    <FormErrorMessage>{errors.phone}</FormErrorMessage>
                </FormControl>
                <FormControl mb={2} isInvalid={!!errors.login}>
                    <FormLabel color="text">Telefon raqami</FormLabel>
                    <Input
                        ref={logInput}
                        placeholder="Telefon raqamigizni kiriting"
                        onChange={() => clearError("login")}
                    />
                    <FormErrorMessage>{errors.login}</FormErrorMessage>
                </FormControl>

                <Flex justify={'flex-end'} mb={2}>
                    <FormControl isInvalid={!!errors.phone}>
                        <Flex justifyContent={'space-between'}>
                            <Flex flexWrap={'wrap'}>
                                <FormLabel color="text">Tumanni tanlang</FormLabel>
                                <Select placeholder="Tumanni tanlang">

                                </Select>
                            </Flex>
                            <Flex flexWrap={'wrap'}>
                                <FormLabel color="text">Mahalani tanlang</FormLabel>
                                <Select placeholder="Mahalani tanlang">

                                </Select>
                            </Flex>
                        </Flex>
                        <FormErrorMessage>{errors.phone}</FormErrorMessage>
                    </FormControl>
                </Flex>

                {/* Password input */}
                <FormControl mb={2} isInvalid={!!errors.password}>
                    <FormLabel color="text">Parol</FormLabel>
                    <Input
                        ref={passInput}
                        type="password"
                        placeholder="Parolni kiriting"
                        onChange={() => clearError("password")}
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>


                {/* Confirm Password input */}
                <FormControl mb={2} isInvalid={!!errors.confirmPassword}>
                    <FormLabel color="text">Parolni tasdiqlash</FormLabel>
                    <Input
                        ref={confirmPassword}
                        type="password"
                        placeholder="Parolni tasdiqlang"
                        onChange={() => clearError("confirmPassword")}
                    />
                    <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>

                {/* Forgot password */}
                <Flex justify={'flex-end'} mb={5}>
                    <Link color="link" fontSize="sm" href="/login">
                        Login qilganmisiz?
                    </Link>
                </Flex>

                {/* Login button */}
                <Button
                    type="submit"
                    style={{ cursor: loading ? "progress" : "pointer" }}
                    w="100%"
                    isLoading={loading}
                    _hover={{ bg: "secondary" }}
                    loadingText="Loading..."
                    variant="solidPrimary"
                >
                    Kirish
                </Button>
            </Box>
        </Flex>
    );
}
