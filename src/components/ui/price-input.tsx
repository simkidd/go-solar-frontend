"use client";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface PriceInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
  value: number | "";
  onChange: (value: number | "") => void;
  className?: string;
}

/**
 * A price input that displays comma-formatted numbers as the user types
 * (e.g. 2000000 → "2,000,000") but calls onChange with the raw numeric value.
 */
const PriceInput: React.FC<PriceInputProps> = ({
  value,
  onChange,
  className,
  placeholder = "0",
  ...props
}) => {
  // Format a number with commas
  const format = (n: number | "") =>
    n === "" || n === 0 ? "" : Number(n).toLocaleString("en-NG");

  const [display, setDisplay] = useState<string>(format(value));
  const prevValue = useRef(value);

  // Sync when value changes externally (e.g. form reset or pre-fill)
  useEffect(() => {
    if (value !== prevValue.current) {
      prevValue.current = value;
      setDisplay(format(value));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // Allow empty
    if (raw === "") {
      setDisplay("");
      onChange("");
      return;
    }

    // Strip everything except digits
    const digitsOnly = raw.replace(/[^0-9]/g, "");
    if (digitsOnly === "") {
      setDisplay("");
      onChange("");
      return;
    }

    const numeric = Number(digitsOnly);
    prevValue.current = numeric;
    setDisplay(Number(digitsOnly).toLocaleString("en-NG"));
    onChange(numeric);
  };

  return (
    <input
      {...props}
      type="text"
      inputMode="numeric"
      value={display}
      onChange={handleChange}
      placeholder={placeholder}
      className={cn(
        "flex h-10 w-full rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs font-bold ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    />
  );
};

export default PriceInput;
