import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button } from "../../../../../../../../components/ui/button";
import { ImageIcon, Send } from "lucide-react";
import { Spinner } from "../../../../../../../../components/ui/spinner";

interface iAppProps {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function MessageComposer({
  value,
  onChange,
  onSubmit,
  isSubmitting,
}: iAppProps) {
  return (
    <>
      <RichTextEditor
        field={{ value, onChange }}
        sendButton={
          <Button
            type="button"
            size={"sm"}
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner /> Sending...
              </>
            ) : (
              "Send"
            )}
          </Button>
        }
        footerLeft={
          <Button variant="outline" size="sm" type="button">
            <ImageIcon className="size-4 mr-1" />
            Attach
          </Button>
        }
      />
    </>
  );
}
