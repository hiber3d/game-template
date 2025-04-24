import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;
  state = new MyRoomState();

  onCreate() {
    this.onMessage("playerPosition", (client, message) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.x = message.x;
        player.z = message.z;
        player.rotX = message.rotX;
        player.rotY = message.rotY;
        player.rotZ = message.rotZ;
        player.rotW = message.rotW;
        player.velocityX = message.velocityX;
        player.velocityZ = message.velocityZ;
      }
    });

    this.onMessage("bulletShot", (client, message) => {
      this.broadcast(
        "remoteBulletShot",
        {
          bulletShot: message,
          ownerId: client.sessionId,
        },
        { except: client }
      );
    });

    this.onMessage("playerDied", (client, message) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.isDead = true;

        const killer = this.state.players.get(message.killedById);
        if (killer) {
          killer.kills += 1;
        }

        setTimeout(() => {
          player.isDead = false;
        }, 3000);
      }
    });

    this.state = new MyRoomState();
  }

  onJoin(client: Client) {
    console.log(client.sessionId, "joined!");
    this.state.players.set(client.sessionId, new Player());
  }

  onLeave(client: Client) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
