import { MessageItem } from "./message/MessageItem";

const messages = [
    {
        id: 1,
        message: "Hello, how are you?",
        date: new Date(),
        avatar:'https://randomuser.me/api/portraits/men/1.jpg',
        userName: "John Doe",
    },
    {
        id: 2,
        message: "I'm good, thanks! How about you?",
        date: new Date(),
        avatar:'https://randomuser.me/api/portraits/women/2.jpg',
        userName: "Jane Smith",
    }
];

export function MessagesList() {
    return (
        <div className="relative h-full">
            <div className="h-full overflow-y-auto px-4">
                {/* Messages will be rendered here */}
                {messages.map((msg) => (
                    <MessageItem  key={msg.id} {...msg} />
                ))}
            </div>
        </div>
    )
}