import { Outlet } from "react-router";
import Sidebar from "../components/common/Sidebar";
import { Box } from "@chakra-ui/react";
import { useUIStore } from "../store/useUIStore";
import { BookDashed, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function JekLayout() {
  const { t } = useTranslation();
  const { collapsed } = useUIStore();

  const links = [
    {
      label: t("jek.sidebar.dashboard"),
      to: "/jek/dashboard",
      icon: BookDashed,
    },
    {
      label: t("jek.sidebar.murojat"),
      to: "/jek/murojat",
      icon: MessageCircle,
    },
  ];

  return (
    <Box>
      <Sidebar collapsed={collapsed} links={links} />

      <Box
        pl={collapsed ? "80px" : "250px"}
        transition="0.25s ease"
        minH="100vh"
      >
        <Outlet />
      </Box>
    </Box>
  );
}