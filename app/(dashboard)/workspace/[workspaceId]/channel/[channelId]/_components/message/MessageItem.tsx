import Image from "next/image";
import { getAvatar } from "@/lib/get-avatar";
import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import { MessageHoverToolbar } from "../toolbar";
import { useCallback, useState } from "react";
import { EditMessage } from "../toolbar/EditMessage";
import { MessagelistItem } from "@/lib/type";
import { MessagesSquare } from "lucide-react";
import { useThread } from "@/providers/ThreadProvider";
import { orpc } from "../../../../../../../../lib/orpc";
import { useQueryClient } from "@tanstack/react-query";

interface iAppProps {
  message: MessagelistItem;
  currentUserId: string;
}

export function MessageItem({ message, currentUserId }: iAppProps) {

  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const { openThread } = useThread();

  const prefetchThread = useCallback(() => {
    const options = orpc.message.thread.list.queryOptions({
      input: {
        messageId: message.id,
      },
    });

    queryClient.prefetchQuery({...options,staleTime:60_000 }).catch((e) => {});
  }, [message.id, queryClient]);

  return (
    <div className="flex space-x-3 relative p-2 rounded-lg group hover:bg-muted/50">
      <Image
        src={getAvatar(message.authorAvatar, message.authorEmail)}
        alt="User image"
        width={32}
        height={32}
        className="size-8 rounded-lg"
      />

      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-x-2">
          <p className="font-medium leading-none">{message.authorname}</p>
          <span className="leading-none text-xs text-muted-foreground">
            {new Intl.DateTimeFormat("en-Us", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(message.createdAt)}
          </span>
          <span className="leading-none text-xs text-muted-foreground">
            {new Intl.DateTimeFormat("en-Us", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(message.createdAt)}
          </span>
        </div>

        {isEditing ? (
          <EditMessage
            message={message}
            onCancel={() => setIsEditing(false)}
            onSave={() => setIsEditing(false)}
          />
        ) : (
          <>
            <SafeContent
              className="text-sm break-word prose dark:prose-invert max-w-none mark:text-primary"
              content={JSON.parse(message.content)}
            />

            {message.imageUrl && (
              <div className="mt-3 ">
                <Image
                  src={message.imageUrl}
                  alt="Message attachment"
                  width={512}
                  height={512}
                  className="rounded-md max-h-80 w-auto object-contain"
                />
              </div>
            )}

            {message.repliesCount > 0 && (
              <button
                onClick={() => openThread(message.id)}
                onMouseEnter={prefetchThread}
                type="button"
                className="mt-2 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border cursor-pointer"
              >
                <MessagesSquare className="size-3.5" />
                <span>
                  {message.repliesCount}
                  {message.repliesCount === 1 ? " reply" : " replies"}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                  View Thread
                </span>
              </button>
            )}
          </>
        )}
      </div>

      <MessageHoverToolbar
        messageId={message.id}
        canEdit={message.authorId === currentUserId}
        onEdit={() => setIsEditing(true)}
      />
    </div>
  );
}
