import { z } from "zod";

export function transformChannelName(name: string): string{
    return name.
    toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove special characters except hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Trim hyphens from start and end
}

export const ChannelNameSchema = z.object({
  name: z
    .string()
    .min(2, "Channel name must be at least 2 characters")
    .max(50, "Channel name must be at most 50 characters")
    .transform((name, ctx) => {
        const transformed  = transformChannelName(name);

        if(transformed.length < 2){
            ctx.addIssue({
                code:'custom',
                message: "Channel name must have at least 2 alphanumeric characters"
            })

            return z.NEVER
        }

        return transformed;
    })
});

export type ChannelNameSchemaType = z.infer<typeof ChannelNameSchema>;