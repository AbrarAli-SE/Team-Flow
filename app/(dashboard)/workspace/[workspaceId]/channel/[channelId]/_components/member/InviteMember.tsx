
import { inviteMemberSchema, InviteMembersSchemaType } from "@/app/schemas/member";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { orpc } from "../../../../../../../../lib/orpc";
import { toast } from "sonner";

export default function InviteMember() {

    const [open, setOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(inviteMemberSchema),
        defaultValues: {
            email: '',
            name: '',
        }
    });

    const inviteMutation = useMutation(
        orpc.workspace.member.invite.mutationOptions({
            onSuccess: () => {
                toast.success("Invitation sent successfully!");
                form.reset();
                setOpen(false);
            },
            onError: (error) => {
                toast.error(error.message || "Failed to send invitation. Please try again.");
            }
        })
    )

    function onSubmit(values: InviteMembersSchemaType) {
        inviteMutation.mutate(values);

    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" >
                    <UserPlus />
                    Invite Members
                </Button    >
            </DialogTrigger>
            <DialogContent className="sm: max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Invite Members</DialogTitle>
                    <DialogDescription>
                        Invite a new member to your workspace by entering their email address below.
                    </DialogDescription>

                </DialogHeader>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Name ..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Email Address ..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                        <Button type="submit" >Send Invitation </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}   