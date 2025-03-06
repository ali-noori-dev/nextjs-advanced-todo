import { Flex, FlexProps } from "@/app/ui/components";
import React from "react";

export const VFlex: React.FC<Omit<FlexProps, "direction">> = ({
  children,
  ...rest
}) => {
  return (
    <Flex direction="column" {...rest}>
      {children}
    </Flex>
  );
};
