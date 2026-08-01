import * as React from "react";
import { Badge, type BadgeProps } from "@/components/ui/badge";

export interface ChipProps extends BadgeProps {}

export function Chip({ className, ...props }: ChipProps) {
  return (
    <Badge
      className={className}
      {...props}
    />
  );
}

export default Chip;
