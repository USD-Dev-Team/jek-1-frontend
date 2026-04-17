import {
  Box,
  Flex,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  InputGroup,
  InputRightElement,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import { useRef, useState } from "react";
import { Auth } from "../../Services/api/Auth";
import { toastService } from "../../utils/toast";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Globe } from "lucide-react";
import data from "../../constants/mahallas.json";
import { useTranslation } from "react-i18next";

export default function Register() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const phoneRegex = /^\+998\d{9}$/;
  const nameRegex = /^[A-Za-z\s'-]+$/;

  const ism = useRef("");
  const fam = useRef("");
  const raqam = useRef("");
  const parol = useRef("");
  const tas = useRef("");

  const tuman = data.uz.addresses;
  const mahalla = data.uz.mahallas;

  const [selectedTuman, setSelectedTuman] = useState("");
  const [selectedMahalla, setSelectedMahalla] = useState("");

  const [errors, setErrors] = useState({
    ism: "",
    fam: "",
    raqam: "",
    parol: "",
    tas: "",
    tuman: "",
    mahalla: "",
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

    const ismVal = ism.current.value.trim();
    const famVal = fam.current.value.trim();
    const raqamVal = raqam.current.value.trim();
    const parolVal = parol.current.value.trim();
    const tasVal = tas.current.value.trim();

    let newErrors = {};

    if (!ismVal) newErrors.ism = t("reg.errors.firstNameRequired");
    else if (!nameRegex.test(ismVal)) newErrors.ism = t("reg.errors.firstNameInvalid");

    if (!famVal) newErrors.fam = t("reg.errors.lastNameRequired");
    else if (!nameRegex.test(famVal)) newErrors.fam = t("reg.errors.lastNameInvalid");

    if (!raqamVal) {
      newErrors.raqam = t("reg.errors.phoneRequired");
    } else if (!phoneRegex.test(raqamVal)) {
      newErrors.raqam = t("reg.errors.phoneInvalid");
    }

    if (!selectedTuman) newErrors.tuman = t("reg.errors.districtRequired");
    if (!selectedMahalla) newErrors.mahalla = t("reg.errors.neighborhoodRequired");

    // PASSWORD
    if (!parolVal) {
      newErrors.parol = t("reg.errors.passwordRequired");
    } else if (parolVal.length < 8) {
      newErrors.parol = t("reg.errors.passwordLength");
    } else if (!/[A-Za-z]/.test(parolVal)) {
      newErrors.parol = t("reg.errors.passwordLetter");
    } else if (!/\d/.test(parolVal)) {
      newErrors.parol = t("reg.errors.passwordNumber");
    }

    // CONFIRM PASSWORD
    if (!tasVal) {
      newErrors.tas = t("reg.errors.confirmRequired");
    } else if (parolVal !== tasVal) {
      newErrors.tas = t("reg.errors.passwordMismatch");
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      const payload = {
        first_name: ismVal,
        last_name: famVal,
        phoneNumber: raqamVal,
        password: parolVal,
        passwordConfirm: tasVal,
        addresses: [
          {
            district: selectedTuman,
            neighborhood: selectedMahalla,
          },
        ],
      };

      await Auth.Register(payload);

      toastService.success(t("reg.success"));
      navigate("/login");
    } catch (err) {
      console.log(err);
      toastService.error(t("reg.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="bg" px={4} position="relative">
      
      {/* LANGUAGE */}
      <Menu>
        <MenuButton position="absolute" top="20px" right="20px" as={Button} size="sm" variant="ghost">
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

      <Box as="form" onSubmit={handleSubmit} w={{ base: "100%", sm: "400px" }} bg="surface" p={8} rounded="xl" shadow="lg">
        
        <Heading textAlign="center" size="lg" mb={6}>
          {t("reg.register")}
        </Heading>

        {/* ISM */}
        <FormControl mb={3} isInvalid={!!errors.ism}>
          <FormLabel>{t("reg.firstName")}</FormLabel>
          <Input ref={ism} onChange={() => clearError("ism")} />
          <FormErrorMessage>{errors.ism}</FormErrorMessage>
        </FormControl>

        {/* FAMILIYA */}
        <FormControl mb={3} isInvalid={!!errors.fam}>
          <FormLabel>{t("reg.lastName")}</FormLabel>
          <Input ref={fam} onChange={() => clearError("fam")} />
          <FormErrorMessage>{errors.fam}</FormErrorMessage>
        </FormControl>

        {/* PHONE */}
        <FormControl mb={3} isInvalid={!!errors.raqam}>
          <FormLabel>{t("reg.phone")}</FormLabel>
          <Input ref={raqam} placeholder="+998901234567" />
          <FormErrorMessage>{errors.raqam}</FormErrorMessage>
        </FormControl>

        {/* TUMAN */}
        <FormControl mb={3} isInvalid={!!errors.tuman}>
          <FormLabel>{t("reg.district")}</FormLabel>
          <Select
            value={selectedTuman}
            onChange={(e) => {
              setSelectedTuman(e.target.value);
              clearError("reg.tuman");
            }}
          >
            <option value="">{t("select")}</option>
            {tuman.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
          <FormErrorMessage>{errors.tuman}</FormErrorMessage>
        </FormControl>

        {/* MAHALLA */}
        <FormControl isInvalid={!!errors.mahalla} isDisabled={!selectedTuman} mb={4}>
          <FormLabel>{t("reg.neighborhood")}</FormLabel>
          <Select
            value={selectedMahalla}
            placeholder={t("reg.selectNeighborhood")}
            onChange={(w) => {
              setSelectedMahalla(w.target.value);
              clearError("mahalla");
            }}
          >
            {mahalla[selectedTuman]?.map((m) => (
              <option value={m} key={m}>{m}</option>
            ))}
          </Select>
          <FormErrorMessage>{errors.mahalla}</FormErrorMessage>
        </FormControl>

        {/* PASSWORD */}
        <FormControl mb={3} isInvalid={!!errors.parol}>
          <FormLabel>{t("reg.password")}</FormLabel>
          <InputGroup>
            <Input
              ref={parol}
              type={show ? "text" : "password"}
              onChange={(e) => {
                const val = e.target.value;

                if (val.length < 8)
                  setErrors(prev => ({ ...prev, parol: t("reg.errors.passwordLength") }));
                else if (!/[A-Za-z]/.test(val))
                  setErrors(prev => ({ ...prev, parol: t("reg.errors.passwordLetter") }));
                else if (!/\d/.test(val))
                  setErrors(prev => ({ ...prev, parol: t("reg.errors.passwordNumber") }));
                else clearError("parol");

                const confirmVal = tas.current.value;

                if (!confirmVal) return;

                if (confirmVal !== val) {
                  setErrors(prev => ({ ...prev, tas: t("reg.errors.passwordMismatch") }));
                } else {
                  clearError("tas");
                }
              }}
            />
            <InputRightElement>
              <IconButton
                size="sm"
                onClick={() => setShow(!show)}
                icon={show ? <EyeOff size={16} /> : <Eye size={16} />}
              />
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.parol}</FormErrorMessage>
        </FormControl>

        {/* CONFIRM */}
        <FormControl mb={4} isInvalid={!!errors.tas}>
          <FormLabel>{t("reg.confirmPassword")}</FormLabel>
          <Input
            ref={tas}
            type="password"
            onChange={(e) => {
              const val = e.target.value;
              const pass = parol.current.value;

              if (!val) setErrors(prev => ({ ...prev, tas: t("reg.errors.confirmRequired") }));
              else if (val !== pass) setErrors(prev => ({ ...prev, tas: t("reg.errors.passwordMismatch") }));
              else clearError("tas");
            }}
          />
          <FormErrorMessage>{errors.tas}</FormErrorMessage>
        </FormControl>

        <Button
          variant="solidPrimary"
          type="submit"
          w="100%"
          isLoading={loading}
          isDisabled={Object.values(errors).some(e => e)}
        >
          {t("register")}
        </Button>
      </Box>
    </Flex>
  );
}