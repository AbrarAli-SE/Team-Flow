"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { orpc } from "@/lib/orpc";
import { getAvatar } from "@/lib/get-avatar";
import { usePresence } from "../../../../../hooks/use-presence";
import { useParams } from "next/navigation";
import { User } from "../../../../schemas/realtime";
import { cn } from "../../../../../lib/utils";

export function WorkspaceMembersList() {
  const { data: { members } } = useSuspenseQuery(orpc.channel.list.queryOptions());

  const { data: workspaceData } = useQuery(orpc.workspace.list.queryOptions());

  // ✅ FIX: Remove useMemo — React Query data is already stable
  const currentUser: User | null = workspaceData?.user
    ? {
        id: workspaceData.user.id,
        full_name: workspaceData.user.given_name,
        email: workspaceData.user.email,
        picture: workspaceData.user.picture,
      }
    : null;

  const params = useParams();
  const workspaceId = params.workspaceId;

  const { onlineUsers } = usePresence({
    room: `workspace-${workspaceId}`,
    currentUser: currentUser,
  });

  const onlineUserIds = new Set(onlineUsers.map((user) => user.id)); // still cheap, no memo needed

  return (
    <div className="space-y-0.5 py-1">
      {members.map((member) => (
        <div
          key={member.id}
          className="px-3 py-2 hover:bg-accent cursor-pointer transition-colors flex items-center space-x-3"
        >
          <div className="relative">
            <Avatar className="size-8 relative">
              <Image
                src={getAvatar(member.picture ?? null, member.email!)}
                alt={member.full_name || "User Avatar"}
                fill
                className="object-cover"
              />
              <AvatarFallback>
                {member.full_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* online / offline indicators */}
            <div
              className={cn(
                "absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-background",
                onlineUserIds.has(member.id ?? "") ? "bg-green-500" : "bg-gray-400"
              )}
            ></div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{member.full_name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {member.email}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
