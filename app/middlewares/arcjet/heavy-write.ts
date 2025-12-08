import arcjet, { slidingWindow } from "@/lib/arcjet";
import { base } from "../base";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const buildStandardAj = () => 
    arcjet.withRule(
        slidingWindow({
            mode: "LIVE",
            interval:'1m',
            max:2
        })
    )

export const heavyWriteSecurityMiddleware = base
  .$context<{
    request: Request;
    user: KindeUser<Record<string, unknown>>;
  }>()
  .middleware(async ({ context, next, errors }) => {
    const decision = await buildStandardAj().protect(context.request, {
      userId: context.user.id,
    });

    if (decision.isDenied()) {
        if (decision.reason.isSensitiveInfo()) {
            throw errors.BAD_REQUEST({
                message: "Sensitive information detected. Please remove PII (example: credit card data, phone numbers).",
            });
        }

        if (decision.reason.isRateLimit()) {
        throw errors.RATE_LIMITED({
          message: "Too many write requests. Please slow down.",
        });
      }

     

      throw errors.FORBIDDEN({
        message: "Request blocked.",
      });
    }

    return next();
  });
