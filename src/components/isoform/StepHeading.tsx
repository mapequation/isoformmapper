import { Box, Circle, Flex, Heading, Progress } from "@chakra-ui/react";

export default function StepHeading({
  step,
  title,
  active,
  loading,
  progress,
}: {
  step: number;
  title: string;
  active?: boolean;
  loading?: boolean;
  progress?: number | null;
}) {
  const accentColor = "var(--chakra-colors-blue-600)";

  return (
    <Box className="step-heading" mb={1}>
      <Flex alignItems="center">
        <Circle
          size="40px"
          border={active ? `2px solid ${accentColor}` : "0"}
          bgColor="#eeeeee"
          fontWeight="bold"
          mr={4}
        >
          {step}
        </Circle>
        <Heading
          size="2xl"
          fontWeight={600}
          letterSpacing="-0.01em"
          style={{ textWrap: "balance" }}
        >
          {title}
        </Heading>
      </Flex>
      <Progress.Root
        value={loading ? (progress ?? null) : 0}
        size="sm"
        mt={2}
        colorPalette="blue"
        visibility={loading ? "visible" : "hidden"}
      >
        <Progress.Track bg="gray.200" borderRadius="full">
          <Progress.Range transition={progress != null ? "none" : undefined} />
        </Progress.Track>
      </Progress.Root>
    </Box>
  );
}
