import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { MemberItem } from "./MemberItem";
import { Skeleton } from "@/components/ui/skeleton";
import { usePresence } from "../../../../../../../../hooks/use-presence";
import { useParams } from "next/navigation";
import { User } from "../../../../../../../schemas/realtime";

export function MemberOverview() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery(
    orpc.workspace.member.list.queryOptions()
  );

  const { data: workspaceData } = useQuery(orpc.workspace.list.queryOptions());

  // ✅ FIX: removed useMemo (React Compiler-safe)
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

  const onlineUserIds = new Set(onlineUsers.map((user) => user.id));

  const members = data ?? [];
  const query = search.trim().toLowerCase();

  const filteredMembers = query
    ? members.filter((member) => {
        const name = member.full_name?.toLowerCase();
        const email = member.email?.toLowerCase();
        return name?.includes(query) || email?.includes(query);
      })
    : members;

  if (error) {
    return (
      <p className="text-sm text-red-500">
        {error.message || "Failed to load members."}
      </p>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={"outline"}>
          <Users />
          <span>Members</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="p-0 w-[300px]">
        <div className="p-0">
          {/* Header */}
          <div className="px-4 py-3 border-b">
            <h3 className="font-semibold text-sm">Workspace Members</h3>
            <p className="text-xs text-muted-foreground">Members</p>
          </div>

          {/* Search */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members..."
                className="pl-9 h-8"
              />
            </div>
          </div>

          {/* Members List */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 px-4 py-2">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-3 w-3/4 rounded-md mt-1" />
                  </div>
                </div>
              ))
            ) : filteredMembers.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground">
                No members found.
              </p>
            ) : (
              filteredMembers.map((member) => (
                <MemberItem
                  key={member.id}
                  member={member}
                  isOnline={member.id ? onlineUserIds.has(member.id) : false}
                />
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
