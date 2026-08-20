"use client";
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface InnerEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TiptapEditorInner: React.FC<InnerEditorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none focus:outline-none min-h-[220px] max-h-[350px] p-4 text-sm text-zinc-900 dark:text-zinc-100",
      },
    },
  });

  // Keep editor content in sync with external value only if it's different to prevent resetting cursor
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter link URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="border border-border/80 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/10 flex flex-col font-inter">
      {/* Toolbar */}
      <div className="bg-muted/40 dark:bg-zinc-900/40 border-b border-border/80 p-2 flex flex-wrap gap-1.5 items-center select-none">
        {/* Undo / Redo */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 rounded-lg cursor-pointer"
        >
          <RotateCcw className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 rounded-lg cursor-pointer"
        >
          <RotateCw className="h-4 w-4 text-muted-foreground" />
        </Button>

        <div className="w-[1px] h-4 bg-border/80 mx-1" />

        {/* Text Formats */}
        <Button
          type="button"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-8 w-8 rounded-lg cursor-pointer transition-colors ${
            editor.isActive("bold") ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-muted-foreground"
          }`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-8 w-8 rounded-lg cursor-pointer transition-colors ${
            editor.isActive("italic") ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-muted-foreground"
          }`}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("underline") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`h-8 w-8 rounded-lg cursor-pointer transition-colors ${
            editor.isActive("underline") ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-muted-foreground"
          }`}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <div className="w-[1px] h-4 bg-border/80 mx-1" />

        {/* Headings */}
        <Button
          type="button"
          variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`h-8 w-8 rounded-lg cursor-pointer transition-colors ${
            editor.isActive("heading", { level: 1 }) ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-muted-foreground"
          }`}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`h-8 w-8 rounded-lg cursor-pointer transition-colors ${
            editor.isActive("heading", { level: 2 }) ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-muted-foreground"
          }`}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`h-8 w-8 rounded-lg cursor-pointer transition-colors ${
            editor.isActive("heading", { level: 3 }) ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-muted-foreground"
          }`}
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-[1px] h-4 bg-border/80 mx-1" />

        {/* Lists */}
        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-8 w-8 rounded-lg cursor-pointer transition-colors ${
            editor.isActive("bulletList") ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-muted-foreground"
          }`}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-8 w-8 rounded-lg cursor-pointer transition-colors ${
            editor.isActive("orderedList") ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-muted-foreground"
          }`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-[1px] h-4 bg-border/80 mx-1" />

        {/* Blockquote & Link */}
        <Button
          type="button"
          variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`h-8 w-8 rounded-lg cursor-pointer transition-colors ${
            editor.isActive("blockquote") ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-muted-foreground"
          }`}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("link") ? "secondary" : "ghost"}
          size="icon"
          onClick={setLink}
          className={`h-8 w-8 rounded-lg cursor-pointer transition-colors ${
            editor.isActive("link") ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-muted-foreground"
          }`}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 bg-white dark:bg-zinc-950/20 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditorInner;
