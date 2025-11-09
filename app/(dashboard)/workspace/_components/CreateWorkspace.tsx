'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { workspaceSchema } from "@/app/schemas/workspace";

export function CreateWorkspace() {
    const [open, setOpen] = useState(false);

    const form = useForm({
        resolver:zodResolver(workspaceSchema),
        defaultValues: {
            name: ""
        }
    });

    function onSubmit(data: any) {
        console.log("Form data:", data);
        // Handle form submission here
    }

    return (
        <TooltipProvider>
            <Dialog open={open} onOpenChange={setOpen}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-12 rounded-xl border-2 border-dashed border-muted-foreground/50 text-muted-foreground hover:border-muted-foreground hover:text-foreground hover:rounded-lg transition-all duration-200">
                                <Plus className="size-5"/>
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>Create Workspace</p>
                    </TooltipContent>
                </Tooltip>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Workspace</DialogTitle>
                        <DialogDescription>
                            Create new workspace to get started
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField 
                                control={form.control} 
                                name="name" 
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Workspace Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="My workspace" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">
                                Create Workspace
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    )
}