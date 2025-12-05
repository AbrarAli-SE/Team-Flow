import z from "zod";

export const inviteMemberSchema = z.object({

    name: z.string().min(3, "Name must be at least 3 characters").max(50),
    email: z.string().email(),
});

export type InviteMembersSchemaType = z.infer<typeof inviteMemberSchema>;
    
