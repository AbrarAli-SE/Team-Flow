import { createChannel, getChannels, listChannels } from "./channel";
import { inviteMember, listMembers } from "./member";
import { createMessage, listMessages, listThreadReplies, toggleReaction, updateMessage } from "./message";
import { createWorkspace, listWorkspaces } from "./workspace";
import { generateThreadSummary, generateCompose } from "./ai";

export const router = {
    workspace: {
        list: listWorkspaces,
        create: createWorkspace,
        member: {
            list: listMembers,
            invite: inviteMember
        }
    },

    channel: {
        create: createChannel,
        list: listChannels,
        get: getChannels,
    },
    message: {
        create: createMessage,
        list: listMessages,
        update: updateMessage,
        reaction: {
            toggle: toggleReaction
        },
        thread: {
            list: listThreadReplies,
        }
    },
    ai: {
        compose: {
            generate: generateCompose
        },
        thread: {
            summary: {
                generate: generateThreadSummary
            }
        }
    }
};