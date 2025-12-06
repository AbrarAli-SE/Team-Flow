import { Message } from "./generated/prisma";

export type MessagelistItem = Message & {
  repliesCount: number;
}