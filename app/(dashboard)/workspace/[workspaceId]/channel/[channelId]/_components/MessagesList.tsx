"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { MessageItem } from "./message/MessageItem";
import { orpc } from "@/lib/orpc";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export function MessagesList() {
  const { channelId } = useParams<{ channelId: string }>();
  const [hasInitialScrolled, setHasInitialScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const infiniteOptions = orpc.message.list.infiniteOptions({
    input: (pageParam: string | undefined) => ({
      channelId: channelId,
      cursor: pageParam,
      limit: 8
    }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    select: (data) => ({
      pages: [...data.pages].map((p) => ({
        ...p,
        items: [...p.items].reverse(),
      })).reverse(),
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
      }
    }
  }, [hasInitialScrolled, data?.pages.length]);

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
  };

  const items = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  return (
    <div className="relative h-full">
      <div 
        className="h-full overflow-y-auto px-4" 
        ref={scrollRef}
        onScroll={handleScroll} // Add this line
      >
        {/* Messages will be rendered here */}
        {items?.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}
        {isFetching && !isFetchingNextPage ? (
          <div className="py-2 text-center text-sm text-muted-foreground">
            Fetching...
          </div>
        ) : null}
      </div>
    </div>
  );
}