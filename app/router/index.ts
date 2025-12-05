import { createChannel, getChannels, listChannels } from "./channel";
import { inviteMemer, listMembers } from "./member";
import { createMessage, listMessages, updateMessage } from "./message";
import { createWorkspace, listWorkspaces } from "./workspace";

export const router = {
    workspace : {
        list:listWorkspaces,
        create: createWorkspace,
        member: {
            list:listMembers,
            invite:inviteMemer
        }
    },

    channel:{
        create: createChannel,
        list:listChannels,
        get: getChannels,
    },
    message: {
        create:createMessage,
        list:listMessages,
        update:updateMessage,
    }
};