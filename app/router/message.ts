import z from "zod";
import { standardSecuritymiddleare } from "../middlewares/arcjet/standard";
import { writeSecurityMiddleware } from "../middlewares/arcjet/write";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import { requiredWorkspaceMiddleware } from "../middlewares/workspace";
import prisma from "../../lib/db";
import { createMessageSchema} from "../schemas/message";
import { getAvatar } from "../../lib/get-avatar";
import { Message } from "../../lib/generated/prisma";

export const createMessage = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecuritymiddleare)
  .use(writeSecurityMiddleware)
  .route({
    method: "POST",
    path: "/messages",
    summary: "Create a new message in a channel",
    tags: ["Messages"],
  })
  .input(createMessageSchema)
  .output(z.custom<Message>())
  .handler(async ({input, context, errors}) => {
    
    // verify the channel exists and belongs to the workspace or user organization

    const channel = await prisma.channel.findFirst({
      where: {
        id: input.channelId,
        workspaceId: context.workspace.orgCode,
      },
    });

    if(!channel){
        throw errors.NOT_FOUND({ message: "Channel not found in the specified workspace" });
    }

    const created = await prisma.message.create({
      data: {
        content: input.content,  
        imageUrl: input.imageUrl,
        channelId: input.channelId,
        authorId: context.user.id,
        authorEmail: context.user.email!,
        authorname: context.user.given_name ?? "Jhon Doe",
        authorAvatar: getAvatar(context.user.picture, context.user.email!),
      },
    });

    return {
        ...created,
    }
  });