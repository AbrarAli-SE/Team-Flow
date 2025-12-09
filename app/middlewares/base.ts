import { os } from "@orpc/server";
import { ArcjetNextRequest } from "@arcjet/next";

export const base = os.$context<{request: Request | ArcjetNextRequest}>().errors({
    RATE_LIMITED: {
        message: "You have been rate limited. Please try again later.",
    },
    BAD_REQUEST:{
        message: "Bad request.",
    },
    NOT_FOUND:{
        message:"Not found.",
    },
    FORBIDDEN:{
        message:"This is forbidden.",
    },
    UNAUTHORIZED:{
        message:"You are not authorized.",
    },
    INTERNAL_SERVER_ERROR:{
        message:"Internal server error.",
    }
})