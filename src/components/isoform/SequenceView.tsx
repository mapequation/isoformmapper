import { Code } from "@chakra-ui/react";
import { getAAColor } from "../../store/PdbStore";

type SequenceViewProps = {
  code: string;
};

export default function SequenceView({ code }: SequenceViewProps) {
  return (
    <Code
      display="block"
      whiteSpace="normal"
      wordBreak="break-all"
      overflowWrap="anywhere"
      px={2}
      py={1}
      lineHeight="1.6"
    >
      {[...code].map((c, i) => (
        <span key={`code[${i}]`} style={{ backgroundColor: getAAColor(c) }}>
          {c}
        </span>
      ))}
    </Code>
  );
}
