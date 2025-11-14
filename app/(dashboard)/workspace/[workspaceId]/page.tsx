import { client } from "@/lib/orpc"
import { redirect } from "next/navigation";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Cloud } from "lucide-react";
import { CreateNewChannel } from "./_components/CreateNewChannel";


interface iAppProps {
  params: Promise<{ workspaceId: string }>;
}

const WorkspaceidPage = async ({ params }: iAppProps) => {

  const { workspaceId } = await params;

  const {channels} = await client.channel.list();

  if(channels.length > 0) {
    return redirect(`/workspace/${workspaceId}/channel/${channels[0].id}`);
  }

  return (
    <div className="flex flex-1 p-16">

    <Empty className="border border-dashed from-muted/50 to-background h-full bg-linear-to-b from-30%  ">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Cloud />
        </EmptyMedia>
        <EmptyTitle>No Channels yet!</EmptyTitle>
        <EmptyDescription>
          Create channels to start collaborating with your team.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="max-w-xs mx-auto">
        <CreateNewChannel />
      </EmptyContent>
    </Empty>
    </div>
  )
}

export default WorkspaceidPage