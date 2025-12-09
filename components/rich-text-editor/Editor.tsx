"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { editorExtensions } from "./extensions";
import { MenuBar } from "./MenuBar";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";
import { ReactNode } from "react";

interface RichTextEditorProps {
  field: Partial<ControllerRenderProps<FieldValues, string>> | { value: string; onChange: (next: string) => void };
  sendButton: ReactNode;
  footerLeft?: ReactNode;
}

export function RichTextEditor({ field, sendButton, footerLeft }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    content: (() => {
      if (!field?.value) return "";

      try {
        return JSON.parse(field.value);
      } catch {
        return "";
      }
    })(),
    onUpdate: ({ editor }) => {
      if (field?.onChange) {
        field.onChange(JSON.stringify(editor.getJSON()));
      }
    },
    extensions: editorExtensions,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[125px] focus:outline-none dark:prose-invert marker:text-primary p-4",
      },
    },
  });

  return (
    <div className="relative w-full border border-input rounded-lg overflow-hidden dark:bg-input/30 flex flex-col">
      <MenuBar editor={editor} />

      <EditorContent editor={editor} className="max-h-[200px] overflow-y-auto" />

      <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-input bg-card">
        <div className="min-h-8 flex items-center">{footerLeft}</div>
        <div className="shrink-0">{sendButton}</div>
      </div>
    </div>
  );
}
