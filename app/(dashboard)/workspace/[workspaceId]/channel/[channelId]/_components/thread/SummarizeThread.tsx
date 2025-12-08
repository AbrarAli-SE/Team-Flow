import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { eventIteratorToStream } from "@orpc/client";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { client } from "@/lib/orpc";
import { Response } from "@/components/elements/response";

interface SummarizeThreadProps {
    messageId: string;
}

export function SummarizeThread({ messageId }: SummarizeThreadProps) {
    const [open, setOpen] = useState(false);

    const { messages, status, error, sendMessage, setMessages, stop, clearError } = useChat({
        id: `thread-sum:${messageId}`,
        transport: {
            async sendMessages(options) {
                return eventIteratorToStream(
                    await client.ai.thread.summary.generate({
                        messageId: messageId,
                    }, {
                        signal: options.abortSignal,
                    })
                );
            },
            reconnectToStream() {
                throw new Error("unsupported");
            },
        },
    });

    const lastAssistant = messages.findLast((message) => message.role === "assistant");

    const summaryText = lastAssistant?.parts.filter((part) => part.type === "text").map((part) => part.text).join("\n\n") ?? "";

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);

        if (nextOpen) {
            const hasAssistantMessage = messages.some((message) => message.role === "assistant");

            if (status !== "ready" || hasAssistantMessage) {
                return;
            }

            sendMessage({ text: "Summarize thread" });
        } else {
            stop();
            clearError();
            setMessages([]);
        }
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button 
                    type="button" 
                    size="sm"
                    className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <span className="flex items-center gap-1.5">
                        <Sparkles className="size-3.5" />
                        <span className="text-xs font-medium">Summarize</span>
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[25rem] p-0" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-bottom">
                    <div className="flex items-center gap-2">
                        <span className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-1.5 px-4">
                            <Sparkles className="size-3.5 text-white" />
                        </span>
                        <span className="text-sm font-medium">AI Summary (Preview)</span>
                    </div>
                    {status === "streaming" && (
                        <Button onClick={() => stop()} type="button" size="sm" variant="outline">
                            Stop
                        </Button>
                    )}
                </div>
                <div className="px-4 py-3 max-h-80 overflow-y-auto">
                    {error ? (
                        <div>
                            <p className="text-red-500">{error.message}</p>
                            <Button 
                                type="button" 
                                size="sm" 
                                onClick={() => {
                                    clearError();
                                    setMessages([]);
                                    sendMessage({ text: "Summarize thread" });
                                }}
                            >
                                Try again
                            </Button>
                        </div>
                    ) : summaryText ? (
                        <Response partialMarkdown={status !== "ready"}>{summaryText}</Response>
                    ) : status === "submitted" || status === "streaming" ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    ) : (
                        <div className="text-muted-foreground">
                            Click summarize to generate
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}