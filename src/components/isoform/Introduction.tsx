import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { useState } from "react";
import { bibtex, citation } from "../../citation";
import { Button } from "../General/Button";

export default function Introduction() {
  const [copied, setCopied] = useState(false);
  const doiUrl = `https://doi.org/${citation.doi}`;

  const copyBibtex = async () => {
    await navigator.clipboard.writeText(bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Flex id="introduction" direction="column" maxW="720px" mt={8} mb={20} gap={4}>
      <Heading size="2xl" fontWeight={600} letterSpacing="-0.01em">
        Compare splice variants by their protein structure
      </Heading>

      <Text color="gray.600">
        Alternative splicing can give one gene several protein isoforms with
        different structures and functions. IsoformMapper compares two isoforms
        at the structural level. It turns each predicted 3D structure, for
        example from AlphaFold, into a network of residues in physical contact,
        finds the structural communities in each network with Infomap, and
        shows in an alluvial diagram how those communities differ between the
        isoforms.
      </Text>

      <Text color="gray.600">
        Work through the four steps below: load the structures, align the
        sequences, build and partition the networks, and compare the
        structures.
      </Text>

      <Box
        mt={2}
        p={4}
        borderWidth="1px"
        borderColor="border.muted"
        borderRadius="md"
        bg="bg.subtle"
      >
        <Heading as="h3" size="md" fontWeight={600} mb={2}>
          How to cite
        </Heading>
        <Text color="gray.600" mb={2}>
          If you use IsoformMapper in your research, please cite:
        </Text>
        <Text>
          {citation.authors}. {citation.title}. <i>{citation.journal}</i>{" "}
          {citation.volume}({citation.issue}):{citation.pages} (
          {citation.year}).{" "}
          <Link href={doiUrl} target="_blank" rel="noreferrer" color="blue.600">
            doi:{citation.doi}
          </Link>
        </Text>
        <Button mt={3} width="auto" flex="none" onClick={copyBibtex}>
          {copied ? "Copied!" : "Copy BibTeX"}
        </Button>
      </Box>
    </Flex>
  );
}
