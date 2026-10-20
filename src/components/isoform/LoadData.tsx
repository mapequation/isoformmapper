import { Box, Input, InputGroup, Table } from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useContext } from "react";
import { StoreContext } from "../../store";

export default observer(function LoadData() {
  const store = useContext(StoreContext);

  const columns = [
    "GeneID",
    "Isoform1",
    "Isoform2",
    "Mechanism",
    "Time1",
    "Time2",
    "Description",
  ];

  const loading = store.input.isAnyStepLoading;

  return (
    <Box>
      <InputGroup
        endElement={
          <Box
            color="gray.500"
            whiteSpace="nowrap"
            fontVariantNumeric="tabular-nums"
            fontSize="sm"
          >
            {`${store.input.filteredExampleData.length} / ${store.input.exampleData.length}`}
          </Box>
        }
        endElementProps={{ width: 100 }}
      >
        <Input
          placeholder="Search…"
          aria-label="Search example data"
          autoComplete="off"
          spellCheck={false}
          value={store.input.filterText}
          onChange={(event) => store.input.setFilterText(event.target.value)}
          disabled={loading}
        />
      </InputGroup>
      <Box
        maxH={210}
        overflowY="auto"
        opacity={loading ? 0.5 : 1}
        pointerEvents={loading ? "none" : "auto"}
        transition="opacity 0.15s ease"
      >
        <Table.Root variant="line" size="sm">
          <Table.Header>
            <Table.Row>
              {columns.map((column) => (
                <Table.ColumnHeader key={column}>{column}</Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {store.input.filteredExampleData.map((row) => (
              <Table.Row
                key={row.id}
                cursor="pointer"
                transition="background-color 0.15s ease"
                _hover={{ bg: "gray.100" }}
                onClick={() => store.input.loadExample(row)}
              >
                <Table.Cell>{row.geneID}</Table.Cell>
                <Table.Cell>
                  *{row.isoform1.substring(row.geneID.length)}
                </Table.Cell>
                <Table.Cell>
                  *{row.isoform2.substring(row.geneID.length)}
                </Table.Cell>
                <Table.Cell>{row.mechanism}</Table.Cell>
                <Table.Cell>{row.time1}</Table.Cell>
                <Table.Cell>{row.time2}</Table.Cell>
                <Table.Cell
                  maxW={{ base: 100, lg: 400 }}
                  overflowX="auto"
                  title={row.description}
                >
                  {row.description}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
});
