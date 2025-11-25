import { createChannel, getChannels, listChannels } from "./channel";
import { createMessage, listMessages } from "./message";
import { createWorkspace, listWorkspaces } from "./workspace";

export const router = {
    workspace : {
        list:listWorkspaces,
        create: createWorkspace,
    },

    channel:{
        create: createChannel,
        list:listChannels,
        get: getChannels,
    },
    message: {
        create:createMessage,
        list:listMessages,
    }
};