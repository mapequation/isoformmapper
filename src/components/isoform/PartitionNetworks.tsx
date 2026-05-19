import {
  Alert,
  Box,
  Button,
  chakra,
  Checkbox,
  Flex,
  Heading,
  HStack,
  NumberInput,
  Slider,
  Text,
} from "@chakra-ui/react";
import { useContext } from "react";
import { observer } from "mobx-react";
import { StoreContext } from "../../store";
import { motion } from "framer-motion";
import { TruncatedFilename } from "../LoadNetworks/Item/components";
import humanFileSize from "../../utils/human-file-size";
import IsoformStore from "../../store/IsoformStore";
import Graph from "./Graph";
import { PdbProgress } from "./Progress";
import NetworkInfo from "./NetworkInfo";
import SelectButtonGroup from "../General/SelectButtonGroup";
import pluralize from "../../utils/pluralize";

const InfomapItem = observer(
  ({ isoform, pdb }: { isoform: IsoformStore; pdb?: boolean }) => {
    const id = `${isoform.isoID}`;

    const store = pdb ? isoform.pdb : isoform;
    const { netFile: file } = store;

    const disabled = store.infomap.isRunning;
    const numTrials = store.infomapArgs.numTrials ?? 10;
    const setNumTrials = (numTrials: number) => store.setArgs({ numTrials });
    const twoLevel = store.infomapArgs.twoLevel ?? false;
    const setTwoLevel = (value: boolean) => store.setArgs({ twoLevel: value });
    const run = () => store.runInfomap();

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Box
          opacity={disabled ? 0.6 : 1}
          pointerEvents={disabled ? "none" : "auto"}
        >
          <HStack justify="space-between">
            <label htmlFor={id} style={{ fontSize: "0.875rem", paddingTop: 4 }}>
              Trials
            </label>
            <NumberInput.Root
              id={id}
              size="xs"
              value={String(numTrials)}
              onValueChange={(details) =>
                setNumTrials(Math.max(1, +details.value))
              }
              min={1}
              max={100}
              step={1}
            >
              <NumberInput.Input />
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
            </NumberInput.Root>
          </HStack>
          <Checkbox.Root
            disabled={disabled}
            size="sm"
            checked={twoLevel}
            onCheckedChange={(details) => setTwoLevel(details.checked === true)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Two-level</Checkbox.Label>
          </Checkbox.Root>
          <Button
            mt={1}
            disabled={disabled}
            loading={disabled}
            size="xs"
            width="full"
            type="submit"
            onClick={run}
          >
            {isoform.haveModules ? "Re-run Infomap" : "Run Infomap"}
          </Button>
        </Box>
        {file && (
          <Box>
            <Text>{humanFileSize(file.size)}</Text>
            {file.isMultilayer && (
              <Text>
                {!file.isExpanded
                  ? pluralize(file.numLayers!, "layer")
                  : "layer " + file.layerId}
              </Text>
            )}
            {file.numTopModules && (
              <Text>{pluralize(file.numTopModules, "top module")}</Text>
            )}
            {file.cluLevel && <Text>level {file.cluLevel}</Text>}
            {!file.cluLevel && file.numLevels && (
              <Text>{pluralize(file.numLevels, "level")}</Text>
            )}
            {file.codelength && (
              <Text>{file.codelength.toFixed(3) + " bits"}</Text>
            )}
          </Box>
        )}
      </motion.div>
    );
  },
);

const NetworkItem = observer(({ isoform }: { isoform: IsoformStore }) => {
  const { pdb } = isoform;
  const file = pdb.netFile;

  return (
    <Box maxW="100%" h="100%" pos="relative" bg="transparent">
      <Heading size="md" mb={2} fontWeight={600}>
        Isoform {isoform.isoID}
      </Heading>
      <Box>
        <Graph isoform={isoform} />
        {pdb.numDatasets > 1 && (
          <Box>
            <SelectButtonGroup
              value={pdb.selectedIndex}
              onChangeSelected={(value) =>
                pdb.setSelectedIndex(value as number)
              }
            >
              {Array.from(Array(pdb.numDatasets).keys()).map((i) => (
                <Button key={i} value={i}>
                  {i + 1}
                </Button>
              ))}
            </SelectButtonGroup>
          </Box>
        )}
      </Box>
      <Box>
        <Box
          bg="gray.50"
          fontSize="sm"
          borderRadius={5}
          boxShadow="md"
          p={2}
          mt={8}
          pos="relative"
        >
          <TruncatedFilename
            name={file?.filename ?? "Pending..."}
            maxLength={100}
          />

          <NetworkInfo isoform={isoform} />

          <InfomapItem isoform={isoform} pdb />
        </Box>

        <PdbProgress isoform={isoform} />
      </Box>
    </Box>
  );
});

export default observer(function PartitionNetworks() {
  const store = useContext(StoreContext);

  const { input } = store;

  return (
    <Flex direction="column" alignItems="center" mb={1}>
      <Text color="gray.600" maxW="640px" mt={2} textAlign="center">
        For each isoform, build a network linking amino acids that sit close in
        3D space. Nodes are identified by their aligned position so equivalent
        residues share an identity across both networks.
      </Text>

      <Box mt={6} w="400px">
        <Box
          fontSize="sm"
          color="gray.700"
          mb={2}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          Link distance threshold:{" "}
          <chakra.span fontWeight={600}>
            {store.input.linkDistanceThreshold.toFixed(1)}&nbsp;Å
          </chakra.span>
        </Box>
        <Slider.Root
          aria-label={["Link distance threshold"]}
          colorPalette="blue"
          value={[store.input.linkDistanceThreshold]}
          onValueChange={(details) =>
            store.input.setLinkDistanceThreshold(details.value[0])
          }
          step={0.1}
          min={0.1}
          max={50}
        >
          <Slider.Control>
            <Slider.Track bg="gray.200">
              <Slider.Range bg="blue.500" />
            </Slider.Track>
            <Slider.Thumb index={0}>
              <Slider.HiddenInput />
            </Slider.Thumb>
          </Slider.Control>
        </Slider.Root>
      </Box>

      <Flex mt={10} gap="24px" justify="center" wrap="wrap">
        <NetworkItem isoform={store.input.isoformStore1} />
        <NetworkItem isoform={store.input.isoformStore2} />
      </Flex>

      {input.canGenerateAlignment && !input.haveAlignment && (
        <Alert.Root mt={10} maxW={400} status="warning">
          <Alert.Indicator />
          <Alert.Content>
            Align the sequences before partitioning them to make the structures
            comparable.
          </Alert.Content>
        </Alert.Root>
      )}
    </Flex>
  );
});
