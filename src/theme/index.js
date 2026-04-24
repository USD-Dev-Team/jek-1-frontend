import { extendTheme } from "@chakra-ui/react";
import colors from "./tokens/colors";
import semanticTokens from "./tokens/semanticTokens";

// Components
import Button from "./components/Button";
import Select from "./components/Select";
const config = {
    initialColorMode: "light",
    useSystemColorMode: true,
}

const theme = extendTheme({
  config,
  colors,
  semanticTokens,

  radii: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
  },

  components: {
    Button,
    Select,
  },

  styles: {
    global: {
      body: {
        bg: "bg",
        color: "text",
      },
    },
  },
});

export default theme