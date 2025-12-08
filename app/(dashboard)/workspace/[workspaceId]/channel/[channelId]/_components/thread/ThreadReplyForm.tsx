"use client";

import { useForm } from "react-hook-form";
import {
  createMessageSchema,
  CreateMessageSchemaType,
} from "@/app/schemas/message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { MessageComposer } from "../message/MessageComposer";
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";
import { useEffect, useState } from "react";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { getAvatar } from "../../../../../../../../lib/get-avatar";
import { MessageListItem } from "@/lib/type";
import { useChannelRealtime } from "../../../../../../../../providers/ChannelRealtimeProvider";

interface ThreadReplyProps {
  threadId: string;
  user: KindeUser<Record<string, unknown>>;
}

export function ThreadReplyForm({ threadId, user }: ThreadReplyProps) {
  const { channelId } = useParams<{ channelId: string }>();

  const upload = useAttachmentUpload();
  const [editorKey, setEditorKey] = useState(0);
  const queryClient = useQueryClient();

  const {send} = useChannelRealtime()

  const form = useForm({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      content: "",
      channelId: channelId,
      threadId: threadId,
    },
  });

  useEffect(() => {
    form.setValue("threadId", threadId);
  }, [threadId, form]);

  const createMessageMutation = useMutation(
    orpc.message.create.mutationOptions({
      onMutate: async (data) => {
        const lisrOptions = orpc.message.thread.list.queryOptions({
          input: { messageId: threadId },
        });

        type MessagePage = {
          items: Array<MessageListItem>;
          nextCursor?: string;
        };

        type InfiniteMessages = InfiniteData<MessagePage>;

        await queryClient.cancelQueries({ queryKey: lisrOptions.queryKey });

        const previous = queryClient.getQueryData(lisrOptions.queryKey);

        const optimistic: MessageListItem = {
          id: `optimistic-${crypto.randomUUID()}`,
          content: data.content,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: user.id,
          authorEmail: user.email!,
          authorname: user.given_name ?? "Unknown User",
          authorAvatar: getAvatar(user.picture, user.email!),
          channelId: data.channelId,
          threadId: data.threadId!,
          imageUrl: data.imageUrl ?? null,
          replyCount: 0,
          reactions: [],
        };

        queryClient.setQueryData(lisrOptions.queryKey, (old) => {
          if (!old) return old;

          return {
            ...old,
            messages: [...old.messages, optimistic],
          };
        });

        // Optimistically bump repliesCount in main message list for the parent message
        queryClient.setQueryData<InfiniteMessages>(
          ["messages.list", channelId],
          (old) => {
            if (!old) return old;

            const pages = old.pages.map((page) => ({
              ...page,
              items: page.items.map((message) =>
                message.id === threadId
                  ? {
                      ...message,
                      replyCount: message.replyCount + 1,
                    }
                  : message
              ),
            }));

            return {
              ...old,
              pages,
            };
          }
        );

        return { lisrOptions, previous };
      },

      onSuccess: (_data, _vars, ctx) => {
        queryClient.invalidateQueries({ queryKey: ctx?.lisrOptions.queryKey });

        form.reset({ channelId, content: "", threadId });
        upload.clear();
        setEditorKey((prev) => prev + 1);
        send({type:'message:replies:increment', payload:{messageId:threadId, delta:1}});
        toast.success("Message reply sent!");
      },
      onError: (_err, _vars, ctx) => {
        if (!ctx) {
          return;
        }

        const { lisrOptions, previous } = ctx;

        if (previous) {
          queryClient.setQueryData(lisrOptions.queryKey, previous);
        }

        toast.error("Something went wrong.");
      },
    })
  );

  function onSubmit(data: CreateMessageSchemaType) {
    createMessageMutation.mutate({
      ...data,
      imageUrl: upload.stagedUrl ?? undefined,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MessageComposer
                  value={field.value}
                  onChange={field.onChange}
                  upload={upload}
                  key={editorKey}
                  onSubmit={() => onSubmit(form.getValues())}
                  isSubmitting={createMessageMutation.isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
