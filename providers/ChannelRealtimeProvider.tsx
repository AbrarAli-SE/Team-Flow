import usePartySocket from "partysocket/react";
import { createContext, useContext, useMemo } from "react";
import {
  ChannelEvent,
  ChannelEventSchema,
  RealTimeMessage,
} from "../app/schemas/realtime";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";

type ChannelRealtimeContextValue = {
  send: (event: ChannelEvent) => void;
};

interface ChannelRealtimeProviderProps {
  channelId: string;
  children: React.ReactNode;
}

type MessageListPage = { items: RealTimeMessage[]; nextCursor?: string };
type InfiniteMessages = InfiniteData<MessageListPage>;

const ChannelRealtimeContext =
  createContext<ChannelRealtimeContextValue | null>(null);

export function ChannelRealtimeProvider({
  channelId,
  children,
}: ChannelRealtimeProviderProps) {
  const queryClient = useQueryClient();

  const socket = usePartySocket({
    host: "127.0.0.1:8787",
    room: `channel-${channelId}`,
    party: "chat",
    onMessage(event) {
      try {
        const parsed = JSON.parse(event.data);
        const result = ChannelEventSchema.safeParse(parsed);

        // console.log("Received channel event:", parsed);

        if (!result.success) {
          console.warn("Invalid channel event");
          return;
        }

        const evt = result.data;

        // console.log("Processing channel event:", evt);

        if (evt.type === "message:created") {
          const raw = evt.payload.message;

          queryClient.setQueryData<InfiniteMessages>(
            ["messages.list", channelId],
            (old) => {
              if (!old)
                return {
                  pages: [
                    {
                      items: [raw],
                      nextCursor: undefined,
                    },
                  ],
                  pageParams: [undefined],
                } as InfiniteMessages;

              const first = old.pages[0];

              const updatedFirst: MessageListPage = {
                ...first,
                items: [raw, ...first.items],
              };

              return {
                ...old,
                pages: [updatedFirst, ...old.pages.slice(1)],
              };
            }
          );
          // Handle new message
          console.log("New message created:", evt.payload.message);
        }

        if (evt.type === "message:updated") {
          const updated = evt.payload.message;

          queryClient.setQueryData<InfiniteMessages>(
            ["messages.list", channelId],
            (old) => {
              if (!old) return old;

              const pages = old.pages.map((page) => ({
                ...page,
                items: page.items.map((m) =>
                  m.id === updated.id ? { ...m, ...updated } : m
                ),
              }));

              return {
                ...old,
                pages,
              };
            }
          );

          return;
          // Handle new message
          //   console.log("Updated message created:", evt.payload.message);
        }

        if (evt.type === "reaction:updated") {
          const { messageId, reactions } = evt.payload;

          queryClient.setQueryData<InfiniteMessages>(
            ["messages.list", channelId],
            (old) => {
              if (!old) return old;


              const pages = old.pages.map((page) => ({
                ...page,
                items: page.items.map((m) =>
                  m.id === messageId ? { ...m, reactions } : m
                ),
              }));
              return {
                ...old,
                pages,
              };
            }
          );
          return;
        }

        if (evt.type === "message:replies:increment") {
          const { messageId, delta } = evt.payload;

          queryClient.setQueryData<InfiniteMessages>(
            ["messages.list", channelId],
            (old) => {
              if (!old) return old;

              
              const pages = old.pages.map((page) => ({
                ...page,
                items: page.items.map((m) =>
                  m.id === messageId ? { ...m, replyCount: Math.max(0, Number(m.replyCount ?? 0) + Number(delta))} : m
                ),
              }));
              return {
                ...old,
                pages,
              };
            }
          );
          return;
        }

      } catch (error) {
        console.log("Failed to process channel message:", error);
      }
    },
  });

  const value = useMemo<ChannelRealtimeContextValue>(() => {
    return {
      send: (event) => {
        socket.send(JSON.stringify(event));
      },
    };
  }, [socket]);

  return (
    <ChannelRealtimeContext.Provider value={value}>
      {children}
    </ChannelRealtimeContext.Provider>
  );
}

export function useChannelRealtime(): ChannelRealtimeContextValue {
  const context = useContext(ChannelRealtimeContext);
  if (!context) {
    throw new Error(
      "useChannelRealtime must be used within a ChannelRealtimeProvider"
    );
  }

  return context;
}
