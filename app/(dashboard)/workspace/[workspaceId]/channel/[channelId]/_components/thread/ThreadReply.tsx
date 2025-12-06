import Image from "next/image";
import { Message } from "@/lib/generated/prisma";
import { SafeContent } from "@/components/rich-text-editor/SafeContent";

interface ThreadReplyProps {
  message:Message;
}

export function ThreadReply({ message }: ThreadReplyProps) {
  return (
    <div className="flex space-x-3 p-3 hover:bg-muted/30 rounded-lg">

        <Image src={message.authorAvatar} alt={"Author Avatar"} width={32} height={32} className="size-8 rounded-full shrink-0"/>
        <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center space">
                    <span className="font-medium text-sm">
                        {message.authorname}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">
                        {new Intl.DateTimeFormat('en-US', {
                            hour:'numeric',
                            minute:'numeric',
                            hour12: true,
                            month: 'short',
                            day: 'numeric'
                            }).format(new Date(message.createdAt))
                            }
                    </span>
                </div>
              
                <SafeContent className="text-sm wrap-break-word prose dark:prose-invert max-w-none marker:text-primary" content={JSON.parse(message.content)} />

                {message.imageUrl && (
                  <div className="mt-2">
                    <Image src={message.imageUrl} alt="Attached Image" width={512} height={512} className="rounded-md max-h-80 w-auto object-contain" />
                  </div>
                )}
            </div>

    </div>
  )
}