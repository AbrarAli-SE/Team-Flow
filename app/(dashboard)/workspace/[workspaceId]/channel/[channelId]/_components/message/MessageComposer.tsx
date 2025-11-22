import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";
import { ImageIcon, Send } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { ImageUploadModal } from "@/components/rich-text-editor/ImageUploadModal";
import { UseAttachmentUploadType } from "@/hooks/use-attachment-upload";
import { AttachmentChip } from "./AttachmentChip";

interface iAppProps {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  upload: UseAttachmentUploadType;
}

export function MessageComposer({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  upload,
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
              <>
                <Send className="size-4 mr-1" />
                Send
              </>
            )}
          </Button>
        }
        footerLeft={
          upload.stagedUrl ? (
            <AttachmentChip url={upload.stagedUrl} onRemove={upload.clear} />
          ) : (
            <Button onClick={() => { upload.setOpen(true) }} variant="outline" size="sm" type="button">
              <ImageIcon className="size-4 mr-1" />
              Attach
            </Button>
          )
        }
      />
      <ImageUploadModal onUploaded={(url) => upload.onUploaded?.(url)} open={upload.isOpen} onOpenChange={upload.setOpen} />
    </>
  );
}