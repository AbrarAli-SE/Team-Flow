import { ChevronDown, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ThreadReply } from "./ThreadReply";
import { ThreadReplyForm } from "./ThreadReplyForm";
import { useThread } from "@/providers/ThreadProvider";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { SafeContent } from "@/components/rich-text-editor/SafeContent";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { ThreadSidebarSkeleton } from "./ThreadSidebarSkeleton";
import { useEffect, useRef, useState } from "react";

interface ThreadSidebarProps {
  user: KindeUser<Record<string, unknown>>;
}

export function ThreadSidebar({ user }: ThreadSidebarProps) {
  const { selectedThreadId, closeThread } = useThread();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const lastMessageCountRef = useRef(0);

  const { data, isLoading } = useQuery(
    orpc.message.thread.list.queryOptions({
      input: {
        messageId: selectedThreadId!,
      },
      enabled: Boolean(selectedThreadId),
    })
  );

  const messageCount = data?.messages.length ?? 0;

  const isNearBottom = (element: HTMLDivElement) =>
    element.scrollHeight - element.scrollTop - element.clientHeight <= 80;

  const handleScroll = () => {
    const element = scrollRef.current;

    if (!element) return;

    setIsAtBottom(isNearBottom(element));
  };

  useEffect(() => {
    if (messageCount === 0) return;

    const prevMessageCount = lastMessageCountRef.current;
    const element = scrollRef.current;
    if (prevMessageCount > 0 && messageCount !== prevMessageCount) {
      if (element && isNearBottom(element)) {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({
            block: "end",
            behavior: "smooth",
          });
        });

        setIsAtBottom(true);
      }
    }

    lastMessageCountRef.current = messageCount;
  }, [messageCount]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const scrollToBottomIfNeeded = () => {
      if (isAtBottom) {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ block: "end" });
        });
      }
    };

    const onImageLoad = (e: Event) => {
      if (e.target instanceof HTMLImageElement) {
        scrollToBottomIfNeeded();
      }
    };
    element.addEventListener("load", onImageLoad, true);

    const resizeObserver = new ResizeObserver(() => {
      scrollToBottomIfNeeded();
    });
    resizeObserver.observe(element);

    const mutationObserver = new MutationObserver(() => {
      scrollToBottomIfNeeded();
    });

    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
    return () => {
      resizeObserver.disconnect();
      element.removeEventListener("load", onImageLoad, true);
      mutationObserver.disconnect();
    };
  }, [isAtBottom]);

  const scrollToBottom = () => {
    const element = scrollRef.current;
    if (!element) return;

    bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });

    setIsAtBottom(true);
  };

  if (isLoading) {
    return <ThreadSidebarSkeleton />;
  }

  return (
    <div className="w-120 border-l flex flex-col h-full">
      {/* header */}

      <div className="border-b h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4" />
          <span className="ml-2 font-medium">Thread</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={"outline"} size={"icon"} onClick={closeThread}>
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 overflow-y-auto relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto"
        >
          {data && (
            <>
              <div className="p-4 border-b bg-muted/20">
                <div className="flex space-x-3">
                  <Image
                    src={data.parent.authorAvatar}
                    alt="author Image"
                    width={32}
                    height={32}
                    className="size-8 rounded-full shrink-0"
                  />
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center space">
                      <span className="font-medium text-sm">
                        {data.parent.authorname}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {new Intl.DateTimeFormat("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                          month: "short",
                          day: "numeric",
                        }).format(new Date(data.parent.createdAt))}
                      </span>
                    </div>
                    <SafeContent
                      className="text-sm wrap-break-word prose dark:prose-invert max-w-none"
                      content={JSON.parse(data.parent.content)}
                    />
                  </div>
                </div>
              </div>

              {/* Thread replies */}
              <div className="p-2 ">
                <p className="text-xs text-muted-foreground mb-3 px-2">
                  {data?.messages.length} replies
                </p>

                <div className="space-y-1">
                  {data?.messages.map((reply) => (
                    <ThreadReply key={reply.id} message={reply} />
                  ))}
                </div>
              </div>

              <div ref={bottomRef}></div>
            </>
          )}
        </div>

          {/* {scroll to bottom button} */}
         {!isAtBottom && (
        <Button
          type="button"
          size="sm"
          onClick={scrollToBottom}
          className="absolute bottom-4 right-5 z-20 size-10 rounded-full hover:shadow-xl transition-all duration-200 ">
          <ChevronDown className="size-4" />
        </Button>
      )}

      </div>

      {/* {thread reply form} */}
      <div className="border-t p-4">
        <ThreadReplyForm threadId={selectedThreadId!} user={user} />
      </div>
    </div>
  );
}
