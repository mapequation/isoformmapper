import { Text } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";

export function TruncatedFilename({
  name,
  maxLength,
}: {
  name: string;
  maxLength: number;
}) {
  const truncatedName = truncateBasename(name, maxLength);
  const sameLength = truncatedName.length === name.length;

  return (
    <Text fontWeight={600} overflowWrap="anywhere">
      {sameLength ? (
        name
      ) : (
        <Tooltip content={name} aria-label={name}>
          <span>{truncatedName}</span>
        </Tooltip>
      )}
    </Text>
  );
}

function truncateBasename(name: string, maxLength = 20) {
  const split = name.split(".");
  const ext = split.pop();
  const base = split.join(".");

  if (base.length < maxLength) return name;

  const hellip = String.fromCharCode(8230); // ...
  return base.slice(0, maxLength) + hellip + ext;
}
