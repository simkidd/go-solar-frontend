"use client";
import React, { useState } from "react";
import { Editor } from "novel";
import { type Editor as TipTapEditor } from "@tiptap/core";
import parse from "html-react-parser";

type NovelEditorProps = {
  setContent: (content: string) => void;
  content: string;
};
export default function NovelEditor({ setContent, content }: NovelEditorProps) {
  return (
    <div className="w-full">
      <label htmlFor="" className="text-sm mb-2">
        Content
      </label>

      <Editor
        defaultValue={{
          type: "doc",
          content: [],
          // content: content as JSONContent[] | undefined,
        }}
        onDebouncedUpdate={(editor?: TipTapEditor) => {
          setContent(editor?.getHTML() || "");
        }}
        disableLocalStorage={true}
        className="rounded-lg bg-[#f4f4f5] dark:bg-[#27272A] shadow-none"
      />
    </div>
  );
}
