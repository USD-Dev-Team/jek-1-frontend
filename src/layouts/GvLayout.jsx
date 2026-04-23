import { Outlet } from "react-router";
import Sidebar from "../components/common/Sidebar";
import { Box } from "@chakra-ui/react";
import { useUIStore } from "../store/useUIStore";
import { BookDashed, MessageCircle, Users, } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function GvLayout() {
  const { t } = useTranslation();
  const { collapsed } = useUIStore();

  const links = [
    // {
    //   label: t("jek.sidebar.dashboard"),
    //   to: "/hokimyat",
    //   icon: BookDashed,
    //   end: true
    // },
    {
      label: t("jek.sidebar.dashboard"),
      to: "/hokim/dashboard",
      icon: MessageCircle,
      end: true
    },
    {
      label: t("jek.sidebar.murojat"),
      to: "/hokim/murojat",
      icon: MessageCircle,
      end: true
    },
    {
      label: t("jek.sidebar.hodimlar"),
      to: "/hokim/hodimlar",
      icon: Users,
      end: true
    }

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