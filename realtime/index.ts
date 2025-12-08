// index.ts

import { ChannelEventSchema, PresenceMessageSchema, ThreadEventSchema, UserSchema } from "../app/schemas/realtime";
import { Connection, routePartykitRequest, Server } from "partyserver";
import { z } from "zod";

type Env = { Chat: DurableObjectNamespace<Chat> };

// Schema for storing user state per connection
const ConnectionStateSchema = z
  .object({
    user: UserSchema.nullable().optional(),
  })
  .nullable();

type ConnectionState = z.infer<typeof ConnectionStateSchema>;
type Message = z.infer<typeof PresenceMessageSchema>;

export class Chat extends Server {
  static options = { hibernate: true };

  onConnect(connection: Connection) {
    console.log("Connected", connection.id, "to server", this.name);

    // Send current presence state immediately
    connection.send(JSON.stringify(this.getPresenceMessage()));
  }

  onClose(connection: Connection) {
    console.log("Connection closed", connection.id);

    this.setConnectionState(connection, null);
    this.updateUsers();
  }

  onError(connection: Connection) {
    console.log("Connection error", connection.id);

    this.setConnectionState(connection, null);
    this.updateUsers();
  }

  // Handle all incoming messages
  onMessage(connection: Connection, rawMessage: string) {
    try {
      const parsed = JSON.parse(rawMessage);
      const presence = PresenceMessageSchema.safeParse(parsed);

      if (presence.success) {
        const data = presence.data;

        if (data.type === "add-user") {
          // Save the user's presence state
          this.setConnectionState(connection, { user: data.payload });
          this.updateUsers();
          return;
        }

        if (data.type === "remove-user") {
          this.setConnectionState(connection, null);
          this.updateUsers();
          return;
        }
      }

      const channelEvent = ChannelEventSchema.safeParse(parsed);

      if(channelEvent.success) {
        const payload = JSON.stringify(channelEvent.data);

        this.broadcast(payload, [connection.id]);
        return;
      }

      // thread events

      const threadsEvents = ThreadEventSchema.safeParse(parsed);
      if(threadsEvents.success) {
        const payload = JSON.stringify(threadsEvents.data); 

        this.broadcast(payload, [connection.id]);
        return;
      }


    } catch (err) {
      console.log("Failed to process message:", err);
    }
  }

  // Broadcast updated user list
  updateUsers() {
    const message = JSON.stringify(this.getPresenceMessage());
    this.broadcast(message);
  }

  // Construct the presence payload
  getPresenceMessage(): Message {
    return {
      type: "presence",
      payload: { users: this.getUsers() },
    };
  }

  // Gather users from all active connections
  getUsers() {
    const users = new Map<string, any>();

    for (const connection of this.getConnections()) {
      const state = this.getConnectionState(connection);

      if (state?.user) {
        users.set(state.user.id, state.user);
      }
    }

    return Array.from(users.values());
  }

  private setConnectionState(connection: Connection, state: ConnectionState) {
    connection.setState(state);
  }

  private getConnectionState(connection: Connection): ConnectionState {
    const result = ConnectionStateSchema.safeParse(connection.state);

    if (result.success) {
      return result.data;
    }

    return null;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return (
      (await routePartykitRequest(request, env)) ||
      new Response("Not Found", { status: 404 })
    );
  },
} satisfies ExportedHandler<Env>;
