import { threadId } from "worker_threads";
import { z } from "zod";
import { GroupedReactionsSchema } from "./message";

export const UserSchema = z.object({
  id: z.string(),
  full_name: z.string().nullable(),
  email: z.string().nullable(),
  picture: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;

export const PresenceMessageSchema = z.union([
  z.object({
    type: z.literal("add-user"),
    payload: UserSchema,
  }),
  z.object({
    type: z.literal("remove-user"),
    payload: z.object({ id: z.string() }),
  }),
  z.object({
    type: z.literal("presence"),
    payload: z.object({ users: z.array(UserSchema) }),
  }),
]);

export type PresenceMessage = z.infer<typeof PresenceMessageSchema>;


// Minimal message shapr for realtime events

export const RealTimeMessageSchema = z.object({
  id:z.string(),
  content:z.string().optional().nullable(),
  imageUrl:z.url().optional().nullable(),
  createdAt:z.coerce.date(),
  updatedAt:z.coerce.date(),
  authorId:z.string(),
  authorEmail:z.string().optional().nullable(),
  authorName:z.string().optional().nullable(),
  authorAvatar:z.string().optional().nullable(),
  channelId:z.string(),
  threadId:z.string().optional().nullable(),


  reactions: z.array(GroupedReactionsSchema).optional(),
  replyCount: z.number().optional(),
})


export type RealTimeMessage = z.infer<typeof RealTimeMessageSchema>;
// Channel level events

export const ChannelEventSchema = z.union([
  z.object({
    type: z.literal("message:created"),
    payload: z.object({
      message: RealTimeMessageSchema,
    }),
  }),
  z.object({
    type: z.literal("message:updated"),
    payload: z.object({message: RealTimeMessageSchema}),
  }),
  z.object({
    type: z.literal("reaction:updated"),
    payload: z.object({messageId: z.string(), reactions: z.array(GroupedReactionsSchema)}),
  }), 
  z.object({
    type: z.literal("message:replies:increment"),
    payload: z.object({messageId: z.string(), delta: z.number()}),
  }),

]);


export type ChannelEvent = z.infer<typeof ChannelEventSchema>;

// Thread level events 

export const ThreadEventSchema = z.union([
  z.object({
    type:z.literal('thread:reply:created'),
    payload:z.object({
      message: RealTimeMessageSchema,
    }),
  }),
  z.object({
    type: z.literal("thread:reaction:updated"),
    payload: z.object({messageId: z.string(), reactions: z.array(GroupedReactionsSchema),
      threadId: z.string()
    }),
  })
]);

export type ThreadEvent = z.infer<typeof ThreadEventSchema>;