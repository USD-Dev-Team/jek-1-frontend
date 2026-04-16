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
  HStack,
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
  const nameRegex = /^[A-Za-z]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

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

    if (!ismVal) newErrors.ism = "Ism majburiy";
    else if (!nameRegex.test(ismVal)) newErrors.ism = "Ism noto‘g‘ri";

    if (!famVal) newErrors.fam = "Familiya majburiy";

    if (!phoneRegex.test(raqamVal))
      newErrors.raqam = "Telefon noto‘g‘ri";

    if (!selectedTuman) newErrors.tuman = "Tuman tanlanmagan";
    if (!selectedMahalla) newErrors.mahalla = "Mahalla tanlanmagan";

    if (!parolVal) newErrors.parol = "Parol majburiy";
    else if (!passwordRegex.test(parolVal))
      newErrors.parol = "Parol kuchsiz";

    if (!tasVal) newErrors.tas = "Tasdiqlash majburiy";
    else if (parolVal !== tasVal)
      newErrors.tas = "Parollar mos emas";

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

      toastService.success("Muvaffaqiyatli ro‘yxatdan o‘tildi");
      navigate("/login");
    } catch (err) {
      console.log(err);
      toastService.error("Xatolik yuz berdi");
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
      {/* 🌐 LANGUAGE */}
      <Menu>
        <MenuButton
          position="absolute"
          top="20px"
          right="20px"
          as={Button}
          size="sm"
          variant="ghost"
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

      <Box
        as="form"
        onSubmit={handleSubmit}
        w={{ base: "100%", sm: "400px" }}
        bg="surface"
        p={8}
        rounded="xl"
        shadow="lg"
      >
        <Heading textAlign="center" size="lg" mb={6}>
          Ro‘yxatdan o‘tish
        </Heading>

        {/* ISM */}
        <FormControl mb={3} isInvalid={!!errors.ism}>
          <FormLabel>Ism</FormLabel>
          <Input ref={ism} onChange={() => clearError("ism")} />
          <FormErrorMessage>{errors.ism}</FormErrorMessage>
        </FormControl>

        {/* FAMILIYA */}
        <FormControl mb={3} isInvalid={!!errors.fam}>
          <FormLabel>Familiya</FormLabel>
          <Input ref={fam} onChange={() => clearError("fam")} />
          <FormErrorMessage>{errors.fam}</FormErrorMessage>
        </FormControl>

        {/* PHONE */}
        <FormControl mb={3} isInvalid={!!errors.raqam}>
          <FormLabel>Telefon</FormLabel>
          <Input ref={raqam} placeholder="+998..." />
          <FormErrorMessage>{errors.raqam}</FormErrorMessage>
        </FormControl>

        {/* TUMAN */}
        <FormControl mb={3} isInvalid={!!errors.tuman}>
          <FormLabel>Tuman</FormLabel>
          <Select
            value={selectedTuman}
            onChange={(e) => {
              setSelectedTuman(e.target.value);
              clearError("tuman");
            }}
          >
            <option value="">Tanlang</option>
              {tuman.map((t)=>{
                return (

                       
              <option key={t} value={t}>
                {t}
              </option>
                )
})}
          </Select>
          <FormErrorMessage>{errors.tuman}</FormErrorMessage>
        </FormControl>

        {/* MAHALLA */}
      <FormControl isInvalid={!!errors.mahalla} isDisabled={!selectedTuman} mb={4} >
                        <FormLabel color="text">Mahalla</FormLabel>
                        <Select
                            value={selectedMahalla}
                            placeholder='Mahallani tanlang'
                            onChange={(w) => {
                                setSelectedMahalla(w.target.value)
                                clearError("mahalla")
                            }}
                        >
                            {mahalla[selectedTuman]?.map((m) => {
                                return (
                                    <option value={m} key={m}>{m}</option>
                                )
                            })}
                        </Select>
                        <FormErrorMessage>{errors.mahalla}</FormErrorMessage>
                    </FormControl>

        {/* PASSWORD */}
        <FormControl mb={3} isInvalid={!!errors.parol}>
          <FormLabel>Parol</FormLabel>
          <InputGroup>
            <Input
              ref={parol}
              type={show ? "text" : "password"}
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
          <FormLabel>Parolni tasdiqlash</FormLabel>
          <Input ref={tas} type="password" />
          <FormErrorMessage>{errors.tas}</FormErrorMessage>
        </FormControl>

        <Button
          variant="solidPrimary"
          type="submit"
          w="100%"
          isLoading={loading}
        >
          Ro‘yxatdan o‘tish
        </Button>
      </Box>
    </Flex>
  );
}