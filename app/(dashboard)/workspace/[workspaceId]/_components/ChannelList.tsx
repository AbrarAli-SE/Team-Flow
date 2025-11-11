"use client";

import { Hash } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";



export function ChannelList() {

  const {data : {channels}} = useSuspenseQuery(orpc.channel.list.queryOptions());

  return (
    <div className="space-y-0.5 py-1">
      {channels.map((channel) => (
        <Link className={buttonVariants({
            variant: "ghost",
            className: "w-full justify-start px-2 py-1 h-7 text-sm text-muted-foreground hover:bg-accent hover:text-foreground rounded-md flex items-center gap-2",
        })} key={channel.id} href={"#"}>
          <Hash className="size-4 " />
          <span className="truncate ">{channel.name}</span>
        </Link>
      ))}
    </div>
  );
}
