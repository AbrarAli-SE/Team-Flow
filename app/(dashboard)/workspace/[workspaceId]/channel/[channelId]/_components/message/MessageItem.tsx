import Image from "next/image";
import { Message } from "@/lib/generated/prisma";
import { getAvatar } from "@/lib/get-avatar";
import { SafeContent } from "@/components/rich-text-editor/SafeContent";

interface iAppProps {
    message: Message
}

export function MessageItem({ message }: iAppProps) {
    return (
        <div className="flex space-x-3 relative p-2 rounded-lg group hover:bg-muted/50">

            <Image
                src={getAvatar(message.authorAvatar, message.authorEmail)}
                alt="User image"
                width={32}
                height={32}
                className="size-8 rounded-lg"
            />


            <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center gap-x-2">
                    <p className="font-medium leading-none">{message.authorname}</p>
                    <span className="leading-none text-xs text-muted-foreground">{new Intl.DateTimeFormat('en-Us', { day: 'numeric', month: 'short', year: 'numeric' }).format(message.createdAt)}</span>
                    <span className="leading-none text-xs text-muted-foreground">{new Intl.DateTimeFormat('en-Us', { hour: '2-digit', minute: '2-digit' }).format(message.createdAt)}</span>
                </div>

                <SafeContent className="text-sm break-word prose dark:prose-invert max-w-none mark:text-primary" content={JSON.parse(message.content)} />

                {message.imageUrl && (
                    <div className="mt-3 ">
                        <Image 
                            src={message.imageUrl}
                            alt="Message attachment"
                            width={512}
                            height={512}
                            className="rounded-md max-h-80 w-auto object-contain"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}