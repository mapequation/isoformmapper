import { Progress } from "@chakra-ui/react";
import { observer } from "mobx-react";
import IsoformStore from "../../store/IsoformStore";

function ProgressComponent({ value }: { value: number }) {
  return (
    <Progress.Root
      value={value}
      max={100}
      size="sm"
      mt={2}
      colorPalette="blue"
      striped
      animated
    >
      <Progress.Track bg="gray.200" borderRadius="full">
        {/* The default Range has a 0.3s width transition. Infomap fires
            progress events faster than the animation completes, so the
            transition was clipping each update — the bar appeared to stall.
            Drop the transition so the fill tracks the value directly. */}
        <Progress.Range bg="blue.500" transition="none" />
      </Progress.Track>
    </Progress.Root>
  );
}

export const IsoformProgress = observer(
  ({ isoform }: { isoform: IsoformStore }) => {
    const { infomap } = isoform;
    if (!infomap.isRunning) {
      return null;
    }
    return <ProgressComponent value={infomap.progress} />;
  }
);

export const PdbProgress = observer(
  ({ isoform }: { isoform: IsoformStore }) => {
    const { infomap } = isoform.pdb;
    if (!infomap.isRunning) {
      return null;
    }
    return <ProgressComponent value={infomap.progress} />;
  }
);
