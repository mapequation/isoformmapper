import { Box, Button, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import IsoformStore from "../../store/IsoformStore";
import { observer } from "mobx-react";
import FileSaver from "file-saver";
import { MdFileDownload } from "react-icons/md";

export const ExportNetwork = observer(function _ExportNetwork({
  isoform,
}: {
  isoform: IsoformStore;
}) {
  const { netFile: file, network } = isoform.pdb;

  return <Box></Box>;
});

export default observer(function NetworkInfo({
  isoform,
}: {
  isoform: IsoformStore;
}) {
  const store = isoform.pdb;
  const { netFile: file, network, name } = store;

  const filename = `${name}.net`;

  const saveNetwork = () => {
    const blob = new Blob([isoform.pdb.serializeNetwork()], {
      type: "plain/text;charset=utf-8",
    });
    FileSaver.saveAs(blob, filename);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Text>
          {`${network.nodes.length.toLocaleString()} nodes and ${network.links.length.toLocaleString()} links.`}
        </Text>
        <Button
          type="button"
          ml={2}
          size="xs"
          onClick={saveNetwork}
          disabled={network.links.length === 0}
        >
          Export network
          <MdFileDownload size={16} aria-hidden="true" />
        </Button>
      </Box>
    </motion.div>
  );
});
