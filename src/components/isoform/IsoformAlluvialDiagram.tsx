import { Button, Flex, Text } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useContext } from "react";
import { StoreContext } from "../../store";
import Diagram from "../Diagram";
import { saveSvg } from "../../io/save-svg";
import { MdFileDownload } from "react-icons/md";

export default observer(function IsoformAlluvialDiagram() {
  const store = useContext(StoreContext);
  const downloadSvg = () => {
    store.setSelectedModule(null);
    const svg = document.getElementById("alluvialSvg") as SVGSVGElement | null;
    if (!svg) return;

    const filename =
      store.diagram.children.map((n) => n.name).join("-") + ".svg";

    setTimeout(() => saveSvg(svg, filename), 500);
  };

  return (
    <Flex direction="column" align="center">
      <Text color="gray.600" mt={2} maxW="640px" textAlign="center">
        Explore modular differences between the two isoforms in an alluvial
        diagram.
      </Text>

      <Flex direction="row" alignItems="center" mt={4} gap={4}>
        <Button
          type="button"
          disabled={!store.input.canGenerateAlluvial}
          onClick={store.input.generateAlluvialDiagram}
        >
          {store.input.haveAlluvial ? "Re-generate Diagram" : "Generate Diagram"}
        </Button>
        {store.input.haveAlluvial && (
          <Button
            type="button"
            onClick={downloadSvg}
            aria-label="Download SVG"
          >
            <MdFileDownload aria-hidden="true" />
            Download SVG
          </Button>
        )}
      </Flex>

      <Flex mt={8}></Flex>
      <Diagram width={900} height={500} />
    </Flex>
  );
});
