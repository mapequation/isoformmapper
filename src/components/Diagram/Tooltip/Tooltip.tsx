import { Tooltip as ChakraTooltip, Portal } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import ModuleTooltip from "./ModuleTooltip";

// Chakra v3's tooltip defaults to a dark/inverted surface. The diagram is on
// a light canvas and the inner chart Box is white, so the dark frame reads as
// an out-of-place black slab. Override to a light surface with a subtle
// border, matching the rest of the app's neutral light palette.
export default function Tooltip({
  children,
  ...props
}: PropsWithChildren<any>) {
  return (
    <ChakraTooltip.Root openDelay={500} positioning={{ placement: "top" }}>
      <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
      <Portal>
        <ChakraTooltip.Positioner>
          <ChakraTooltip.Content
            bg="white"
            color="gray.800"
            borderRadius="md"
            borderWidth="1px"
            borderColor="gray.200"
            shadow="lg"
            p={0}
            maxW="none"
          >
            <ChakraTooltip.Arrow
              css={{
                "--arrow-background": "white",
                "--arrow-size": "8px",
              }}
            >
              <ChakraTooltip.ArrowTip
                css={{
                  borderTop: "1px solid",
                  borderLeft: "1px solid",
                  borderColor: "var(--chakra-colors-gray-200)",
                }}
              />
            </ChakraTooltip.Arrow>
            <ModuleTooltip {...props} />
          </ChakraTooltip.Content>
        </ChakraTooltip.Positioner>
      </Portal>
    </ChakraTooltip.Root>
  );
}
