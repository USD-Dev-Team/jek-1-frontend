import { Outlet } from "react-router";
import Sidebar from "../components/common/Sidebar";
import { Box } from "@chakra-ui/react";
import { useUIStore } from "../store/useUIStore";
import { BookDashed, EqualApproximatelyIcon, MessageCircle, User2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function InLayout() {
  const { t } = useTranslation();
  const { collapsed } = useUIStore();

  const links = [

     {
      label: "Boshqaruv paneli",
      to: "/inseksiya/dashboard",
      icon: EqualApproximatelyIcon,
    },
   
    {
      label: t("jek.sidebar.murojat"),
      to: "/inseksiya/murojat",
      icon: MessageCircle,
    },
     {
      label: t("hodim.hodim.hodimlar"),
      to: "/inseksiya/hodim",
      icon: User2Icon,
    },
     {
      label: t("idashboard.idashboard.dashboard"),
      to: "/inseksiya/dashboard",
      icon: EqualApproximatelyIcon,
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