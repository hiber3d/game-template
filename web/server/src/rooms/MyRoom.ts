import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;
  state = new MyRoomState();

  onCreate(options: any) {
    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
    this.onMessage("playerPosition", (client, message) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.x = message.x;
        player.z = message.z;
        player.rotX = message.rotX;
        player.rotY = message.rotY;
        player.rotZ = message.rotZ;
        player.rotW = message.rotW;
      }
    });

    this.state = new MyRoomState();
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.state.players.set(client.sessionId, new Player());
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
