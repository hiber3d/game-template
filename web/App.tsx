import { Hiber3D, useHiber3D } from "@hiber3d/web";
import { moduleFactory as webGL } from "GameTemplate_webgl";
import { moduleFactory as webGPU } from "GameTemplate_webgpu";
import { useEffect, useRef, useState } from "react";

import { Client, getStateCallbacks, Room } from "colyseus.js";
import { MyRoomState, Player } from "server/src/rooms/schema/MyRoomState";

const client = new Client("http://localhost:2567");

const GameHandler = ({ children }: { children: React.ReactNode }) => {
  const { api } = useHiber3D();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    const listener = api.onGameStarted(() => {
      setStarted(true);
    });

    return () => {
      api.removeEventCallback(listener);
    };
  }, [api]);

  if (!started) {
    return null;
  }

  return <>{children}</>;
};

type PlayerInfo = { id: string } & Pick<Player, "kills">;

function RoomComponent() {
  const { api } = useHiber3D();
  const roomRef = useRef<Room>(null);

  const [, setIsConnecting] = useState(true);
  const [players, setPlayers] = useState<PlayerInfo[]>([]);

  useEffect(() => {
    const req = client.joinOrCreate<MyRoomState>("my_room", {});

    req.then((room) => {
      roomRef.current = room;
      const $ = getStateCallbacks(room);

      setIsConnecting(false);

      // const a = $(room.state).onChange(() => {
      //   a();
      //   // console.log("Initial state:", room.state);
      //   room.state.players.forEach((player, sessionId) => {
      //     if (room.sessionId === sessionId) {
      //       return;
      //     }
      //     // console.log("Player joined:", player, sessionId);
      //     api?.writePlayerJoined({
      //       id: sessionId,
      //     });
      //     // you can now safely read state.count, state.players, etc.
      //   });
      // });

      $(room.state).players.onChange((changes, index) => {
        if (room.sessionId === index) {
          return;
        }
        api?.writePlayerJoined({
          id: index,
        });
      });

      $(room.state).players.onAdd((player, sessionId) => {
        console.log("Player joined:", player, sessionId);
        setPlayers((players) => [...players, { id: sessionId, kills: player.kills }]);

        $(player).listen("isDead", (isDead) => {
          api?.writePlayerIsDeadChanged({
            id: sessionId,
            isLocalPlayer: room.sessionId === sessionId,
            isDead,
          });
        });

        $(player).listen("kills", (kills) => {
          setPlayers((players) =>
            players.map((p) => {
              if (p.id === sessionId) {
                return { ...p, kills };
              }
              return p;
            })
          );
        });

        if (room.sessionId === sessionId) {
          // this is the local player
          return;
        }

        api?.writePlayerJoined({
          id: sessionId,
        });

        $(player).onChange(() => {
          api?.writePlayerUpdate({
            id: sessionId,
            x: player.x,
            z: player.z,
            rotX: player.rotX,
            rotY: player.rotY,
            rotZ: player.rotZ,
            rotW: player.rotW,
            velocityX: player.velocityX,
            velocityZ: player.velocityZ,
            isDead: player.isDead,
          });
          // console.log("Player changed:", player);
        });
      });

      // handle room events here
      $(room.state).players.onRemove((player, sessionId) => {
        api?.writePlayerLeft({
          id: sessionId,
        });
        setPlayers((players) => players.filter((p) => p.id !== sessionId));
      });

      room.onMessage("remoteBulletShot", (message) => {
        api?.writeRemoteBulletShot(message);
      });
    });

    return () => {
      // make sure to leave the room when the component is unmounted
      req.then((room) => {
        room.leave();
        roomRef.current = null;
      });
    };
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const positionListener = api.onPlayerPosition((payload) => {
      // console.log(payload);
      roomRef.current?.send("playerPosition", payload);
    });

    const bulletListener = api.onBulletShot((payload) => {
      roomRef.current?.send("bulletShot", payload);
    });

    const diedListener = api.onLocalPlayerDied((payload) => {
      roomRef.current?.send("playerDied", payload);
    });

    return () => {
      api.removeEventCallback(positionListener);
      api.removeEventCallback(bulletListener);
      api.removeEventCallback(diedListener);
    };
  });

  return (
    <div style={{ position: "absolute", top: 20, left: 20, width: 200 }}>
      {players
        .toSorted((a, b) => b.kills - a.kills)
        .map((player) => (
          <div style={{ display: "grid", gridTemplateColumns: "1fr min-content", gap: 10 }} key={player.id}>
            <div>{player.id}</div>
            <div>{player.kills}</div>
          </div>
        ))}
    </div>
  );
}

export const App = () => (
  <Hiber3D build={{ webGPU, webGL }}>
    <GameHandler>
      <RoomComponent />
    </GameHandler>
  </Hiber3D>
);
