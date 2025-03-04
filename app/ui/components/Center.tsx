import React from "react";
import { Flex, FlexProps } from "./Flex";

export const Center: React.FC<FlexProps> = ({
  children,
  justify = "center",
  align = "center",
  ...rest
}) => {
  return (
    <Flex justify={justify} align={align} {...rest}>
      {children}
    </Flex>
  );
};
