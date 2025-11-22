"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { MessageItem } from "./message/MessageItem";
import { orpc } from "@/lib/orpc";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function MessagesList() {
  const { channelId } = useParams<{ channelId: string }>();
  const [hasInitialScrolled, setHasInitialScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [newMessages, setNewMessages] = useState(false);
  const lastItemIdRef = useRef<string | undefined>(undefined);

  const infiniteOptions = orpc.message.list.infiniteOptions({
    input: (pageParam: string | undefined) => ({
      channelId: channelId,
      cursor: pageParam,
      limit: 8,
    }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
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

  useEffect(() => {
    if (!hasInitialScrolled && data?.pages.length) {
      const element = scrollRef.current;
      if (element) {
        element.scrollTop = element.scrollHeight;
        setHasInitialScrolled(true);
        setIsAtBottom(true);
      }
    }
  }, [hasInitialScrolled, data?.pages.length]);

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

        setNewMessages(false);
        setIsAtBottom(true);
      } else {
        setNewMessages(true);
      }
    }

    lastItemIdRef.current = lastItemId;
  }, [items]);

  const scrollToBottom = () => {
    const element = scrollRef.current;
    if (!element)  return;
    
      element.scrollTop = element.scrollHeight;
      setNewMessages(false);
      setIsAtBottom(true);
  }

  return (
    <div className="relative h-full">
      <div
        className="h-full overflow-y-auto px-4 flex flex-col space-y-1"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {items?.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}

        <div ref={bottomRef}></div>
      </div>
      {newMessages && !isAtBottom && (
        <Button
          type="button"
          className="absolute bottom-4 right-8 rounded-full " 
          onClick={scrollToBottom}
        >
          New Messages
        </Button>
      )}
    </div>
  );
}
