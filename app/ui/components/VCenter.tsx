import { Center, FlexProps } from "@/app/ui/components";
import React from "react";

export const VCenter: React.FC<Omit<FlexProps, "direction">> = ({
  children,
  ...rest
}) => {
  return (
    <Center direction="column" {...rest}>
      {children}
    </Center>
  );
};
