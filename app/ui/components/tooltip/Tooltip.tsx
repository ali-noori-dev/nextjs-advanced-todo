"use client";

import {
  ComponentPropsWithoutRef,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styles from "./tooltip.module.scss";

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
} & ComponentPropsWithoutRef<"div">;

export function Tooltip({
  content,
  children,
  position = "top",
  className = "",
  ...restProps
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const targetRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const spacing = 8;

      let top = 0;
      let left = 0;

      switch (position) {
        case "top":
          top = targetRect.top - tooltipRect.height - spacing;
          left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          break;
        case "bottom":
          top = targetRect.bottom + spacing;
          left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
          break;
        case "left":
          top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          left = targetRect.left - tooltipRect.width - spacing;
          break;
        case "right":
          top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
          left = targetRect.right + spacing;
          break;
      }

      // Clamp to viewport
      const maxLeft = window.innerWidth - tooltipRect.width - 4;
      const maxTop = window.innerHeight - tooltipRect.height - 4;

      setCoords({
        top: Math.max(4, Math.min(top, maxTop)),
        left: Math.max(4, Math.min(left, maxLeft)),
      });
    }
  }, [visible, position]);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  return (
    <>
      <div
        ref={targetRef}
        className={`${styles.tooltip} ${className}`}
        onMouseEnter={show}
        onMouseLeave={hide}
        {...restProps}
      >
        {children}
      </div>

      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            className={`${styles.tooltip__content}`}
            style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}
