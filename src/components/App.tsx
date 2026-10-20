import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react";
import IsoformApp from "./isoform/IsoformApp";
import Logo from "./Logo";
import { useColorModeValue } from "./ui/color-mode";

export default observer(function App() {
  const bg = useColorModeValue("white", "var(--chakra-colors-gray-900)");

  return (
    <>
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        height="6rem"
        bg={bg}
        zIndex={1500}
        borderBottom="1px solid"
        borderColor="gray.200"
        px={10}
        display="flex"
        alignItems="center"
      >
        <Logo showVersion />
      </Box>

      <IsoformApp />
    </>
  );
});
