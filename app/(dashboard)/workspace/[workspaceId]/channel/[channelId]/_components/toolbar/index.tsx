import { Button } from "@/components/ui/button";
import { MessageSquareText, Pencil } from "lucide-react";

interface toolbarProps {
  messageId: string;
  canEdit: boolean;
  onEdit: () => void;
}

export function MessageHoverToolbar({
  canEdit,
  onEdit,
  messageId,
}: toolbarProps) {
return (
  <div className="absolute -right-2 -top-3 flex items-center gap-0 rounded-md border border-gray-200 bg-white/95 px-0.5 py-0.5 shadow-sm backdrop-blur transition-opacity opacity-0 group-hover:opacity-100 dark:border-neutral-800 dark:bg-neutral-900/90">
    {canEdit && (
      <>
        <Button variant="ghost" onClick={onEdit} className="px-2">
          <Pencil className="size-4" />
        </Button>
        <div className="h-4 w-px bg-gray-300 dark:bg-neutral-700"></div>
      </>
    )}
    
    <Button variant="ghost" className="px-2">
      <MessageSquareText className="size-4" />
    </Button>
  </div>
);
}
