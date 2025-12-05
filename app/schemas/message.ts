import z from "zod";

export const createMessageSchema = z.object({
  channelId: z.string(),
  content: z.string().min(1).max(5000),
  imageUrl:z.url().optional(),
});

export type CreateMessageSchemaType = z.infer<typeof createMessageSchema>;

export const updateMessageSchema = z.object({
  messageId: z.string(),
  content: z.string().min(1).max(5000),
});


export type UpdateMessageSchemaType = z.infer<typeof updateMessageSchema>;