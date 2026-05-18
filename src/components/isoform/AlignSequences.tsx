import {
  Box,
  Button,
  Code,
  Flex,
  Text,
  chakra,
} from "@chakra-ui/react";
import { useContext } from "react";
import { StoreContext } from "../../store";
import { getAAColor } from "../../store/PdbStore";
import { observer } from "mobx-react";

export default observer(function AlignSequences({}: {}) {
  const store = useContext(StoreContext);
  const { alignment, isoforms } = store.input;

  return (
    <Flex
      className="step-heading"
      direction="column"
      alignItems="center"
      mb={1}
    >
      <Text color="gray.600" mt={2} maxW="640px" textAlign="center">
        Calculate a sequence alignment so corresponding amino acids share
        identifiers across isoforms.
      </Text>

      <Flex direction="column" alignItems="center" mt={4}>
        <Button
          type="button"
          disabled={!store.input.canGenerateAlignment}
          onClick={store.input.generateAlignment}
        >
          Align Sequences
        </Button>

        {alignment.length > 0 && (
          <Box overflowX="auto" maxW={800} mt={6}>
            {alignment.map(({ name, sequence }) => (
              <Code
                key={`${name}-code`}
                display="block"
                whiteSpace="nowrap"
                py={1}
              >
                {[...sequence].map((c, i) => (
                  <span
                    key={`${name}-code[${i}]`}
                    title={`${i + 1}_${c}`}
                    style={{
                      backgroundColor: c === "-" ? "#eeeeee" : getAAColor(c),
                    }}
                  >
                    {c}
                  </span>
                ))}
              </Code>
            ))}
          </Box>
        )}
        {alignment.length > 0 && (
          <Box mt={3}>
            <Text
              fontSize="sm"
              color="gray.600"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              Amino acids — isoform 1:{" "}
              <chakra.span fontWeight={600} color="gray.800">
                {isoforms[0].sequence?.code.length ?? 0}
              </chakra.span>
              , isoform 2:{" "}
              <chakra.span fontWeight={600} color="gray.800">
                {isoforms[1].sequence?.code.length ?? 0}
              </chakra.span>
              , alignment:{" "}
              <chakra.span fontWeight={600} color="gray.800">
                {alignment[0].sequence.length ?? 0}
              </chakra.span>
            </Text>
          </Box>
        )}
      </Flex>
    </Flex>
  );
});
