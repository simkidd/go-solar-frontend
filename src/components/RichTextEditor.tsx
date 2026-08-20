"use client";
import React, { useState, useEffect } from "react";
import TiptapEditorInner from "./TiptapEditorInner";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`h-56 w-full bg-muted/20 animate-pulse rounded-xl border border-border/80 flex flex-col justify-between p-4 ${className}`}>
        <div className="flex gap-2 mb-4 border-b border-border/60 pb-3">
          <div className="h-7 w-7 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-7 w-7 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-7 w-7 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-7 w-7 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <TiptapEditorInner
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
