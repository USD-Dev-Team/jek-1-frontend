import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// LOGIN
import authUZ from "./modules/LOGIN/uz.json";
import authRU from "./modules/LOGIN/ru.json";
import authEN from "./modules/LOGIN/eng.json";

// REGISTER
import regUz from "./modules/REGISTER/uz.json";
import regEn from "./modules/REGISTER/en.json";
import regRu from "./modules/REGISTER/ru.json";

// LAYOUT
import jekUz from "./modules/Layout/uz.json";
import jekRu from "./modules/Layout/ru.json";
import jekEn from "./modules/Layout/en.json";

// MUROJAT
import murUz from "./modules/murojat/uz.json";
import murRu from "./modules/murojat/ru.json";
import murEn from "./modules/murojat/en.json";

// HODIM
import hdUz from "./modules/hodim/uz.json";
import hdRu from "./modules/hodim/ru.json";
import hdEn from "./modules/hodim/en.json";

//  SIDEBAR
import sidebarUz from "./modules/sidebar/uz.json";
import sidebarRu from "./modules/sidebar/ru.json";
import sidebarEn from "./modules/sidebar/en.json";

// === RESOURCES ===
const resources = {
  uz: {
    translation: {
      auth: authUZ,
      reg: regUz,
      jek: jekUz,
      murojat: murUz,
      hodim: hdUz,
      sidebar: sidebarUz, 
    },
  },
  ru: {
    translation: {
      auth: authRU,
      reg: regRu,
      jek: jekRu,
      murojat: murRu,
      hodim: hdRu,
      sidebar: sidebarRu, 
    },
  },
  en: {
    translation: {
      auth: authEN,
      reg: regEn,
      jek: jekEn,
      murojat: murEn,
      hodim: hdEn,
      sidebar: sidebarEn, 
    },
  },
};

// INIT
i18n.use(initReactI18next).init({
  lng: localStorage.getItem("lang") || "uz",
  fallbackLng: "uz",
  interpolation: {
    escapeValue: false,
  },
  resources,
});

export default i18n;