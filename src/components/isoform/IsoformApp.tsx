import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useContext } from "react";
import { StoreContext } from "../../store";
import StepHeading from "./StepHeading";
import AlignSequences from "./AlignSequences";
import LoadData from "./LoadData";
import PartitionNetworks from "./PartitionNetworks";
import useEventListener from "../../hooks/useEventListener";
import IsoformAlluvialDiagram from "./IsoformAlluvialDiagram";
import SequenceView from "./SequenceView";
import { LuCircleCheck } from "react-icons/lu";
import DropData from "./DropData";
import { Button } from "../Sidebar/components";

export default observer(function IsoformApp() {
  const store = useContext(StoreContext);
  useEventListener("keydown", (event) => {
    // @ts-ignore
    const key = event?.key;
    if (!store.editMode && key === "e") {
      store.input.loadExample(store.input.exampleData[0]);
    }
  });

  return (
    <Container
      mt="100px"
      maxW={1800}
      display="flex"
      flexDir="column"
      alignItems="center"
    >
      <Flex id="step1" direction="column" alignItems="center" mb={20}>
        <StepHeading
          step={1}
          title="Load data"
          loading={
            store.input.isoformStore1.isLoading ||
            store.input.isoformStore2.isLoading
          }
        />

        <Text color="gray.600" mt={2} maxW="640px" textAlign="center">
          Drop your own <code>.pdb</code> files below, or pick an example to get
          started.
        </Text>

        <Flex gap="24px" mt={6} wrap="wrap" justify="center">
          {store.input.isoforms.map((isoformStore, i) => (
            <Flex key={i} direction="column" maxW={{ base: 400, md: 600 }}>
                <Heading as="h3" size="lg" mb={3} display="flex" fontWeight={600}>
                  Isoform {i + 1}
                  <Box
                    as={LuCircleCheck}
                    ml={3}
                    alignSelf="center"
                    color={
                      isoformStore.pdb.numDatasets > 0
                        ? "green.500"
                        : "gray.200"
                    }
                  />
                </Heading>

                <DropData isoform={isoformStore} />

                {isoformStore.sequence && (
                  <Flex mt={6} direction="column">
                    {/* <Heading as="h4" size="sm">
                      Sequence
                    </Heading> */}
                    <SequenceView code={isoformStore.sequence.code} />
                    <Button
                      alignSelf="end"
                      width="auto"
                      onClick={isoformStore.pdb.clear}
                    >
                      Clear
                    </Button>
                  </Flex>
                )}
            </Flex>
          ))}
        </Flex>

        <Flex mt={10} direction="column" alignItems="center">
          <Heading as="h4" size="md" mb={4} fontWeight={600}>
            Load example data
          </Heading>
          <LoadData />
        </Flex>
      </Flex>

      <Flex id="step2" direction="column" alignItems="center" mb={20}>
        <StepHeading
          step={2}
          title="Align sequences"
          loading={store.input.isAligning}
        />

        <AlignSequences />

        <Flex mt={8}></Flex>
      </Flex>

      <Flex id="step3" direction="column" alignItems="center" mb={20}>
        <StepHeading
          step={3}
          title="Generate and partition networks"
          loading={
            store.input.isoformStore1.pdb.infomap.isRunning ||
            store.input.isoformStore2.pdb.infomap.isRunning
          }
          progress={
            store.input.isoformStore1.pdb.infomap.isRunning ||
            store.input.isoformStore2.pdb.infomap.isRunning
              ? (store.input.isoformStore1.pdb.infomap.progress +
                  store.input.isoformStore2.pdb.infomap.progress) /
                2
              : null
          }
        />

        <PartitionNetworks />

        <Flex mt={8}></Flex>
      </Flex>

      <Flex id="step4" direction="column" alignItems="center" mb={20}>
        <StepHeading step={4} title="Compare structures" />

        <IsoformAlluvialDiagram />
      </Flex>
    </Container>
  );
});
