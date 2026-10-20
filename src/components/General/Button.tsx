import { Button as CkButton, ButtonProps } from "@chakra-ui/react";

export function Button(props: ButtonProps) {
  return (
    <CkButton
      width="full"
      flex="1"
      minW={0}
      variant="outline"
      // size="xs" gives the v2 sm height (~32px); fontSize="sm" restores the
      // v2 sm label size (~14px) since v3's "xs" textStyle defaults to 12px.
      size="xs"
      fontSize="sm"
      justifyContent="flex-start"
      fontWeight={500}
      {...props}
    />
  );
}
