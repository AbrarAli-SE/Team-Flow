import { ChannelHeader } from "./_components/ChannelHeader";
import { MessagesList } from "./_components/MessagesList";

const ChannelPageMain = () => {
  return (
    <div className="flex h-screen w-full ">
      {/* { main Chnanel Area } */}

      <div className="flex flex-col flex-1 min-w-0">
        {/* {fixed header} */}
        <ChannelHeader />

        {/* {scroll able messages Area} */}
      <div className=" flex-1 overflow-hidden mb-4">
        <MessagesList />
      </div>

      
      </div>

      
    </div>
  );
};

export default ChannelPageMain;
