import { Group, GroupProps } from "@chakra-ui/react";
import React from "react";

// Match the v2 look: active button reads as "outlined" (transparent bg with a
// visible gray border) while inactive buttons read as "filled" gray. Both
// keep a clearly different hover state so the affordance is unambiguous.
//
// NOTE: pseudo selectors (`_hover`, `_active`) are passed as top-level props
// rather than nested in `css`. Chakra v3 merges recipe variants and component
// pseudo props at the same specificity, and the `css` prop's nested
// `_hover` was being overridden by the outline-variant recipe's own
// `_hover` — leaving inactive buttons visually inert on hover. Top-level
// props win.
const activeProps = {
  bg: "transparent",
  color: "gray.800",
  borderColor: "gray.200",
  _hover: { bg: "gray.50" },
};

const inactiveProps = {
  bg: "gray.100",
  color: "gray.700",
  borderColor: "gray.100",
  _hover: { bg: "gray.200", borderColor: "gray.200" },
  _active: { bg: "gray.300" },
};

interface SelectButtonGroupProps extends GroupProps {
  onChangeSelected: (value: string | number) => void;
  value: string | number;
  children: React.ReactElement<any>[];
}

export const SelectButtonGroup: React.FC<SelectButtonGroupProps> = (props) => {
  const { value, onChangeSelected, children, ...groupProps } = props;
  return (
    <Group attached {...groupProps}>
      {React.Children.map(children, (Child) => {
        const isActive = value === Child.props?.value;
        return React.cloneElement(Child, {
          variant: "outline",
          onClick: () => {
            if (isActive) return;
            onChangeSelected(Child.props?.value);
          },
          "aria-pressed": isActive,
          transition: "background-color 0.12s ease, border-color 0.12s ease",
          ...(isActive ? activeProps : inactiveProps),
        });
      })}
    </Group>
  );
};

export default SelectButtonGroup;
