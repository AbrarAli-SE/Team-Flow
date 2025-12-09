import { useEffect, useState } from "react";
import usePartySocket from "partysocket/react";
import { PresenceMessage, PresenceMessageSchema, User } from "../app/schemas/realtime";

interface usePresenceProps {
    room: string;
    currentUser: User | null;
}

export function usePresence({ room, currentUser }: usePresenceProps) {
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

    const socket = usePartySocket({
        host: "https://team-flow-chat-saad-realtime.abrarali-se.workers.dev",
        room,
        party: "chat",
        onOpen() {
            console.log("Connected to presence room", room);
        },
        onMessage(event) {
            try {
                const message = JSON.parse(event.data);
                const parsed = PresenceMessageSchema.safeParse(message);

                if (parsed.success && parsed.data.type === "presence") {
                    setOnlineUsers(parsed.data.payload.users);
                }
            } catch (err) {
                console.log("Failed to parse presence message", err);
            }
        },
        onClose() {
            console.log("Disconnected from presence room", room);
        },
    });

    // 🔥 If currentUser becomes available later (after socket open)
    // send add-user
    useEffect(() => {
        if (currentUser && socket.readyState === 1) {
            socket.send(JSON.stringify({
                type: "add-user",
                payload: currentUser
            } as PresenceMessage));
        }
    }, [currentUser, socket.readyState]);

    return { onlineUsers, socket };
}
