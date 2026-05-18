import { HStack } from "@chakra-ui/react";
import Infomap from "@mapequation/infomap";
import { useColorModeValue } from "./ui/color-mode";
import ToggleColorMode from "./ToggleColorMode";

export default function Logo({ showVersion = false }) {
  const color = useColorModeValue("hsl(0, 0%, 33%)", "hsl(0, 0%, 60%)");
  const brand = useColorModeValue("hsl(0, 68%, 42%)", "hsl(0, 68%, 62%)");

  return (
    <HStack w="100%" justify="space-between" align="center">
      <HStack justify="flex-start" align="center" gap={3}>
        <a href="//mapequation.org" aria-label="mapequation.org">
          <img
            alt=""
            width="32"
            height="32"
            src="//www.mapequation.org/assets/img/twocolormapicon_whiteboarder.svg"
          />
        </a>
        <div>
          <span
            style={{
              fontFamily: "Philosopher, serif",
              fontWeight: 700,
              fontSize: "1.4em",
            }}
          >
            <span style={{ color: brand }}>Isoform</span>
            <span style={{ color }}>Mapper</span>
          </span>
          {showVersion && (
            <span style={{ color }}>
              {" v" + import.meta.env.VITE_APP_VERSION}
            </span>
          )}
          <div style={{ marginTop: -4, fontSize: "0.75em", color }}>
            Powered by Infomap v{Infomap.__version__}
          </div>
        </div>
      </HStack>
      <ToggleColorMode />
    </HStack>
  );
}
