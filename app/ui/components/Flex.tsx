import { Property } from "csstype";
import React from "react";

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: Property.FlexDirection;
  justify?: Property.JustifyContent;
  align?: Property.AlignItems;
  wrap?: Property.FlexWrap;
  gap?: string;
}

export const Flex: React.FC<FlexProps> = ({
  children,
  direction,
  justify,
  align,
  wrap,
  gap,
  ...rest
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        flexWrap: wrap,
        gap,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
