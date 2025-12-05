import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  updateMessageSchema,
  UpdateMessageSchemaType,
} from "@/app/schemas/message";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";
import { Message } from "@/lib/generated/prisma";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { Spinner } from "../../../../../../../../components/ui/spinner";

interface EditMessageProps {
  message: Message;
  onCancel: () => void;
  onSave: () => void;
}

export function EditMessage({ message, onCancel, onSave }: EditMessageProps) {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(updateMessageSchema),
    defaultValues: {
      messageId: message.id,
      content: message.content,
    },
  });

  const updateMutation = useMutation(
    orpc.message.update.mutationOptions({
      onSuccess: (updated) => {
        type MessagePage = {
          items: Message[];
          nextCursor?: string;
        };
        type InfiniteMessages = InfiniteData<MessagePage>;
        queryClient.setQueryData<InfiniteMessages>(
          ["messages.list", message.channelId],
          (old) => {
            if (!old) {
              return old;
            }

            const updatedMessage = updated.message;

            const pages = old.pages.map((page) => ({
              ...page,
              items: page.items.map((msg) =>
                msg.id === updatedMessage.id
                  ? { ...msg, ...updatedMessage }
                  : msg
              ),
            }));

            return {
              ...old,
              pages,
            };
          }
        );
        toast.success("Message updated successfully.");
        onSave();
      },
      onError: (error) => {
        console.log(error)
        toast.error(error.message || "Failed to update message.");
      },
    })
  );

  function onSubmit(data: UpdateMessageSchemaType) {
    updateMutation.mutate(data);
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
                <RichTextEditor
                  field={field}
                  sendButton={
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        size={"sm"}
                        variant={"outline"}
                        onClick={onCancel}
                        disabled={updateMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button size={"sm"} type="submit" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? <><Spinner/>Saving...</> : "Save"}
                      </Button>
                    </div>
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
