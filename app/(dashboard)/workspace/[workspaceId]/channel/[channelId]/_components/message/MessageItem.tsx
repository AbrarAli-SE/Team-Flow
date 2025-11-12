import Image from "next/image";

interface iAppProps {
    id:number,
    message:string,
    date:Date,
    avatar:string,
    userName:string
}

export function MessageItem({ id, message, date, avatar, userName }: iAppProps) {
    return(
        <div className="flex space-x-3 relative p-2 rounded-lg group hover:bg-muted/50">

            <Image 
            src={avatar}
                alt="User image"
                width={32}
                height={32}
                className="size-8 rounded-lg"
            />


            <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center gap-x-2">
                    <p className="font-medium leading-none">{userName}</p>
                    <span className="leading-none text-xs text-muted-foreground">{new Intl.DateTimeFormat('en-Us',{day:'numeric', month:'short', year:'numeric'}).format(date)}</span>
                    <span className="leading-none text-xs text-muted-foreground">{new Intl.DateTimeFormat('en-Us',{hour:'2-digit', minute:'2-digit'}).format(date)}</span>
                </div>

                <p className="text-sm break-words max-w-none">{message}</p>
            </div>
        </div>
    )
}