import {
  Box,
  Flex,
  Text,
  Icon,
  VStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Tooltip,
  useColorMode,
  Image,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  HStack,
} from "@chakra-ui/react";

import { NavLink, useNavigate } from "react-router-dom";

import {
  ChevronLeft,
  ChevronRight,
  Globe,
  LucideLogOut,
  SunMoon,

} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

import { useUIStore } from "../../store/useUIStore";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";



export default function Sidebar({ links = [] }) {
  const { toggleColorMode } = useColorMode();
  const collapsed = useUIStore((s) => s.collapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const  {onOpen, onClose, isOpen} = useDisclosure();


  const { i18n } = useTranslation();

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };






  return (
    <>
      {/* 🔝 TOP RIGHT */}
      <Flex position="fixed" top="15px" right="20px" gap={2} zIndex={2000}>
       

        <Menu >
          <MenuButton mr={3} as={Button} size="sm" variant="solidPrimary">
            <Flex align="center"  gap={1}>
              <Globe size={16} />
              {i18n.language.toUpperCase()}
            </Flex>
          </MenuButton>

          <MenuList>
            <MenuItem onClick={() => changeLang("uz")}>🇺🇿 Uzbek</MenuItem>
            <MenuItem onClick={() => changeLang("ru")}>🇷🇺 Русский</MenuItem>
            <MenuItem onClick={() => changeLang("en")}>🇬🇧 English</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {/* SIDEBAR */}
      <Flex
        position="fixed"
        w={collapsed ? "72px" : "240px"}
        minH="100vh"
        bg="surface"
        color="text"
        direction="column"
        justify="space-between"
        px={2}
        py={4}
      >
        {/* COLLAPSE */}
        <Button
          position="absolute"
          right="0"
          top="15px"
          size="sm"
          borderRadius="full"
          borderRightRadius={0}
          onClick={toggleSidebar}
          variant="ghost"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>

        {/* TOP */}
        <VStack align="stretch" mt="40px" spacing={3}>
          {!collapsed && (
            <Flex justify="center">
              <Image src="/logo.png" sizes="30px" />
            </Flex>
          )}

          {/*  LINKS */}
          <VStack align="stretch" spacing={1}>
            {links.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {({ isActive }) => (
                  <Tooltip label={collapsed ? item.label : ""}>
                    <Flex
                      align="center"
                      justify={collapsed ? "center" : "flex-start"}
                      gap={3}
                      px={3}
                      py={2}
                      borderRadius="md"
                      bg={isActive ? "secondary" : "transparent"}
                      color={isActive ? "white" : "text"}
                      _hover={{ bg: "secondary", color: "white" }}
                    >
                
                      <Icon as={item.icon} boxSize={5} />

                      {!collapsed && (
                        <Text color={isActive ? "white" : "text"}>
                          {item.label}
                        </Text>
                      )}
                    </Flex>
                  </Tooltip>
                )}
              </NavLink>
            ))}
          </VStack>
        </VStack>

        {/* BOTTOM */}
        <VStack align="stretch" spacing={2}>
          {/* THEME */}
          <Flex
            align="center"
            justify={collapsed ? "center" : "flex-start"}
            gap={2}
            px={collapsed ? 0 : 3}
            py={2}
            borderRadius="md"
            _hover={{ bg: "secondary", color: "white" }}
            cursor="pointer"
            onClick={toggleColorMode}
          >
            <SunMoon size={18} />
            {!collapsed && <Text fontSize="sm">Theme</Text>}
          </Flex>

          {/* PROFILE */}
          <Flex
            align="center"
            justify={collapsed ? "center" : "space-between"}
            px={collapsed ? 0 : 3}
            py={2}
            borderTop="1px solid"
            borderColor="border"
          >
            <Flex align="center" gap={2}>
              <Avatar
                size="sm"
                name={Cookies.get('first_name')}
              />

              {!collapsed && (
                <Box >
                  <HStack  fontSize="sm" fontWeight="600">
                    <Text>
                    {Cookies.get('first_name')}
                    </Text>
                    <Text>
                    {Cookies.get('last_name')}
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="textSecondary">
                    {Cookies.get("role")}
                  </Text>
                </Box>
              )}
            </Flex>

            {!collapsed && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onOpen}
              >
                <LucideLogOut size={16} />
              </Button>
            )}
          </Flex>

          {/* COLLAPSED LOGOUT */}
          {collapsed && (
            <Flex justify="center">
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                <LucideLogOut size={18} />
              </Button>
            </Flex>
          )}
        </VStack>


        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader >
              <Text>Chiqish</Text>
            </ModalHeader>
            <ModalBody>
              <Text>Tizimdan chiqmoqchimsz ?</Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onClick={onClose}>
        Bekor qilish
      </Button>
      <Button
        colorScheme="red"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Ha, chiqaman
      </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
}