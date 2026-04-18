import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Auth } from "../../Services/api/Auth";
import { useAuth } from "../../hooks/useAuth";
import { toastService } from "../../utils/toast";

import { useNavigate } from "react-router";
import { InputGroup, InputRightElement, IconButton } from "@chakra-ui/react";
import { Eye, EyeOff, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const passInput = useRef("");
  const logInput = useRef("");

  const [errors, setErrors] = useState({
    login: "",
    password: "",
  });

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginText = logInput.current.value.trim();
    const password = passInput.current.value.trim();

    let newErrors = {};

    //  VALIDATION
    if (!loginText) {
      newErrors.login = t("auth.login.errors.phone_required");
    }

    if (!password) {
      newErrors.password = t("auth.login.errors.password_required");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      const payload = {
        phoneNumber: String(loginText),
        password: password,
      };

      const res = await Auth.Login(payload);

      if (res.status === 200 || res.status === 201) {
        const data = res.data;
        //  save auth
        login({
          token: data.accessToken,
          refreshToken: data.refreshToken,
          role: data.role,
          userId: data.userId,
          first_name: data.first_name,
          last_name: data.last_name,
          district: data?.addresses?.[0]?.district || '',
         neighborhood: data?.addresses?.[0]?.neighborhood || "",
        });

        //  ROLE BO‘YICHA REDIRECT
        if (data.role === "JEK") {
          navigate("/jek/dashboard");
          toastService.success("JEK panelga xush kelibsiz");
        } else if (data.role === "GOVERNMENT") {
          navigate("/hokim/dashboard");
          toastService.success("Government panelga xush kelibsiz");
        } else if (data.role === "INSPECTION") {
        
          navigate("/inseksiya/dashboard");
          toastService.success("Inseksiya panelga xush kelibsiz");
        } else {
          // } else if (data.role === "WAREHOUSE" || data.role === "warehouse") {
          //   navigate("/warehouse");
          //   toastService.success("Warehouse panelga xush kelibsiz");
          // } else {
      
          toastService.error("Role mos kelmadi");
        }
      } else {
        toastService.error(res?.data?.message || "Login xato");
  

      }
    } catch (err) {
      toastService.error(err?.response?.data?.message || "Tizim xatosi");

    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="bg"
      px={4}
      position="relative"
    >
      {/* 🌐 LANGUAGE SWITCHER */}
      <Menu>
        <MenuButton
          position="absolute"
          top="20px"
          right="20px"
          as={Button}
          size="sm"
          variant="solidPrimary"
        >
          <Flex align="center" gap={1}>
            <Globe size={16} />
            {i18n.language.toUpperCase()}
          </Flex>
        </MenuButton>

        <MenuList>
          <MenuItem onClick={() => changeLang("uz")}>UZ</MenuItem>
          <MenuItem onClick={() => changeLang("ru")}>RU</MenuItem>
          <MenuItem onClick={() => changeLang("en")}>EN</MenuItem>
        </MenuList>
      </Menu>

      {/* FORM */}
      <Box
        as="form"
        onSubmit={handleSubmit}
        w={{ base: "100%", sm: "400px" }}
        bg="surface"
        p={8}
        rounded="xl"
        shadow="lg"
      >
        <Heading textAlign="center" size="lg" mb={2}>
          {t("auth.login.title")}
        </Heading>

        <Text textAlign="center" color="gray.500" mb={6}>
          {t("auth.login.subtitle")}
        </Text>

        <FormControl mb={4} isInvalid={!!errors.login}>
          <FormLabel>{t("auth.login.phone")}</FormLabel>
          <Input
            type="text"
            placeholder={t("auth.login.phone_placeholder")}
            ref={logInput}
            onChange={() => clearError("login")}
          />
          <FormErrorMessage>{errors.login}</FormErrorMessage>
        </FormControl>

        <FormControl mb={2} isInvalid={!!errors.password}>
          <FormLabel>{t("auth.login.password")}</FormLabel>

          <InputGroup size="sm">
            <Input
              ref={passInput}
              type={show ? "text" : "password"}
              placeholder={t("auth.login.password_placeholder")}
              onChange={() => clearError("password")}
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

          <FormErrorMessage fontSize="xs">{errors.password}</FormErrorMessage>
        </FormControl>

        <Flex justifyContent="end" mb={2}>
          <Text
            onClick={() => navigate("/register")}
            cursor="pointer"
            color="link"
          >
            {t("auth.login.register")}
          </Text>
        </Flex>

        <Button
          variant={"solidPrimary"}
          mt={2}
          type="submit"
          w="100%"
          isLoading={loading}
        >
          {t("auth.login.button")}
        </Button>
      </Box>
    </Flex>
  );
}
