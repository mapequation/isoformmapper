import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useState } from "react";
import IsoformApp from "./isoform/IsoformApp";
import Logo from "./Logo";
import NodeList from "./NodeList";
import { useColorModeValue } from "./ui/color-mode";
import { DialogRoot } from "./ui/dialog";

export const drawerWidth = 350;

export default observer(function App() {
  const bg = useColorModeValue("white", "var(--chakra-colors-gray-900)");
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);

  const onExplorerClose = () => setIsExplorerOpen(false);

  return (
    <>
      <DialogRoot
        size="xl"
        placement="center"
        open={isExplorerOpen}
        onOpenChange={(e) => !e.open && onExplorerClose()}
      >
        {isExplorerOpen && <NodeList onClose={onExplorerClose} />}
      </DialogRoot>

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
