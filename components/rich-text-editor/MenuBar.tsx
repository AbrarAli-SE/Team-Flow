import { Editor, useEditorState } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import {
  Bold,
  Code,
  Italic,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { ComposeAssistant } from "./compose-assistant";
import { markdownToJSON } from "@/lib/markdown-to-json";

interface MenuBarProps {
  editor: Editor | null;
}

export function MenuBar({ editor }: MenuBarProps) {
  const editorState = useEditorState({
    editor,
    selector: ({ editor }: { editor: Editor | null }) => {
      if (!editor) return null;
      return {
        isActive: {
          bold: editor.isActive("bold"),
          italic: editor.isActive("italic"),
          strike: editor.isActive("strike"),
          codeBlock: editor.isActive("codeBlock"),
          bulletList: editor.isActive("bulletList"),
          orderedList: editor.isActive("orderedList"),
        },
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
        currentContent: editor.getJSON(),
      };
    },
  });

  function handleAcceptCompose(markdown: string) {
    try {
      const json = markdownToJSON(markdown);
      editor?.commands.setContent(json);
    } catch {
      console.log("something went wrong");
    }
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-input border-t-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
      <TooltipProvider>
        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("bold")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBold().run()
                }
                className={cn(
                  editorState?.isActive.bold && "bg-muted text-muted-foreground"
                )}
              >
                <Bold />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("italic")}
                onPressedChange={() =>
                  editor.chain().focus().toggleItalic().run()
                }
                className={cn(
                  editorState?.isActive.italic && "bg-muted text-muted-foreground"
                )}
              >
                <Italic />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("strike")}
                onPressedChange={() =>
                  editor.chain().focus().toggleStrike().run()
                }
                className={cn(
                  editorState?.isActive.strike && "bg-muted text-muted-foreground"
                )}
              >
                <Strikethrough />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Strike</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("codeBlock")}
                onPressedChange={() =>
                  editor.chain().focus().toggleCodeBlock().run()
                }
                className={cn(
                  editorState?.isActive.codeBlock &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <Code />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Code Block</TooltipContent>
          </Tooltip>
        </div>
        <span className="mx-2 border-l h-5 bg-border" />
        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("bulletList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                className={cn(
                  editorState?.isActive.bulletList &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <List />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("orderedList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                className={cn(
                  editorState?.isActive.orderedList &&
                    "bg-muted text-muted-foreground"
                )}
              >
                <ListOrdered />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Ordered List</TooltipContent>
          </Tooltip>
        </div>
        <span className="mx-2 border-l h-5 bg-border" />
        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => editor.chain().focus().undo().run()}
                size={"sm"}
                variant={"ghost"}
                type="button"
                disabled={!editorState?.canUndo}
              >
                <Undo />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => editor.chain().focus().redo().run()}
                size={"sm"}
                variant={"ghost"}
                type="button"
                disabled={!editorState?.canRedo}
              >
                <Redo />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex flex-wrap gap-1">
          <ComposeAssistant
            content={JSON.stringify(editorState?.currentContent)}
            onAccept={handleAcceptCompose}
          />
        </div>
      </TooltipProvider>
    </div>
  );
}
