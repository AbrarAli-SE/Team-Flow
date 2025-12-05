"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { MessageItem } from "./message/MessageItem";
import { orpc } from "@/lib/orpc";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/general/EmptyState";
import { ChevronDown, Loader2 } from "lucide-react";

export function MessagesList() {
  const { channelId } = useParams<{ channelId: string }>();
  const [hasInitialScrolled, setHasInitialScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const lastItemIdRef = useRef<string | undefined>(undefined);

  const infiniteOptions = orpc.message.list.infiniteOptions({
    input: (pageParam: string | undefined) => ({
      channelId: channelId,
      cursor: pageParam,
      limit: 8,
    }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    queryKey: ["messages.list", channelId],
    select: (data) => ({
      pages: [...data.pages]
        .map((p) => ({
          ...p,
          items: [...p.items].reverse(),
        }))
        .reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    ...infiniteOptions,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  //scroll to the bottom when messages first load
  useEffect(() => {
    if (!hasInitialScrolled && data?.pages.length) {
      const element = scrollRef.current;
      if (element) {

        bottomRef.current?.scrollIntoView({ block: "end" });
        // element.scrollTop = element.scrollHeight;
        setHasInitialScrolled(true);
        setIsAtBottom(true);
      }
    }
  }, [hasInitialScrolled, data?.pages.length]);

  //keep view pinned to bottom when new messages arrive

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const scrollToBottomIfNeeded = () => {

      if (isAtBottom || !hasInitialScrolled) {
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

  }, [isAtBottom, hasInitialScrolled]);

  const isNearBottom = (element: HTMLDivElement) =>
    element.scrollHeight - element.scrollTop - element.clientHeight <= 80;

  const handleScroll = () => {
    const element = scrollRef.current;

    if (!element) return;

    if (element.scrollTop <= 80 && hasNextPage && !isFetching) {
      const prevScrollHeight = element.scrollHeight;
      const prevScrollTop = element.scrollTop;
      fetchNextPage().then(() => {
        const newScrollHeight = element.scrollHeight;
        element.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop;
      });
    }

    setIsAtBottom(isNearBottom(element));
  };

  const items = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  const isEmpty = !isLoading && !error && items.length === 0;

  useEffect(() => {
    if (!items.length) return;

    const lastItemId = items[items.length - 1].id;

    const prevLastItemId = lastItemIdRef.current;

    const element = scrollRef.current;

    if (prevLastItemId && lastItemId !== prevLastItemId) {
      if (element && isNearBottom(element)) {
        requestAnimationFrame(() => {
          element.scrollTop = element.scrollHeight;
        });

        setIsAtBottom(true);
      } 
    }

    lastItemIdRef.current = lastItemId;
  }, [items]);

  const scrollToBottom = () => {
    const element = scrollRef.current;
    if (!element) return;

    bottomRef.current?.scrollIntoView({ block: "end" });

    setIsAtBottom(true);
  }

  return (
    <div className="relative h-full">
      <div
        className="h-full overflow-y-auto px-4 flex flex-col space-y-1"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {isEmpty ? (
          <div className="flex h-full pt-4">
            <EmptyState
              title="No Messages Yet"
              description="Start the conversation by sending the first message."
              buttonText="Send a Message"
              href="#" />
          </div>
        ) : (
          items?.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))
        )
        }

        <div ref={bottomRef}></div>
      </div>
      {
        isFetchingNextPage && (
          <div className="pointer-events-none absolute top-0 left-0 right-0 z-20
          flex justify-center items-center py-2">
            <div className="flex items-center gap-2 rounded-md  bg-linear-to-b 
            from-white/80 to-transparent dark:from-neutral-900/80 backdrop-blur px-3 py-1">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
              <span> Loading Previous Messages...</span>


            </div>
          </div>
        )
      }

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
  );
}
