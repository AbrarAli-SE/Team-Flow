"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { editorExtensions } from "./extensions";
import { MenuBar } from "./MenuBar";

export function RichTextEditor(){


    const editor = useEditor({
        immediatelyRender: false,
        extensions:editorExtensions,
        editorProps:{
            attributes: {
                class:
                    "prose prose-sm sm:prose lg:prose-lg xl:prose-xl m-0 max-w-none min-h-[125px] focus:outline-none dark:prose-invert p-4",
            },
        }
    });

    return (

        <div className="relative w-full border border-input rounded-lg overflow-hidden dark:bg-input/30 flex flex-col">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="max-h-[200px] overflow-y-auto"/>
        </div>
    )
}