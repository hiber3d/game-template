import { Hiber3D, useHiber3D } from "@hiber3d/web";
import { moduleFactory as webGL } from "GameTemplate_webgl";
import { moduleFactory as webGPU } from "GameTemplate_webgpu";
import { useEffect, useRef, useState } from "react";

import { Client, getStateCallbacks, Room } from "colyseus.js";
import { MyRoomState, Player } from "server/src/rooms/schema/MyRoomState";

const client = new Client("http://localhost:2567");

const GameHandler = () => {
  const { api, canvasRef } = useHiber3D();
  const [nameInput, setNameInput] = useState<string | null>(localStorage.getItem("name"));
  const [name, setName] = useState<string | null>(null);
  const [readyToStart, setReadyToStart] = useState(false);
  const [room, setRoom] = useState<Room<MyRoomState> | null>(null);

  const join = async (name: string) => {
    setName(name);
    localStorage.setItem("name", name);
    canvasRef?.focus();
    try {
      const response = await client.joinOrCreate<MyRoomState>("my_room", {
        name,
      });
      setRoom(response);
    } catch (e) {
      console.error("Error joining room:", e);
    }
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    const listener = api.onGameStarted(() => {
      setReadyToStart(true);
    });

    return () => {
      api.removeEventCallback(listener);
    };
  }, [api]);

  if (!name) {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backdropFilter: "blur(5px)",
        }}
      >
        <div style={{ maxWidth: 300, width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={{ backgroundColor: "black", padding: 12, borderRadius: 10 }}>
            <div style={{ fontSize: 12 }}>Your name</div>
            <input
              autoFocus
              style={{ outline: "none", width: "100%" }}
              type="text"
              placeholder="Enter your name"
              value={nameInput ?? ""}
              data-1p-ignore
              onChange={(e) => {
                const value = e.currentTarget.value;
                setNameInput(value);
              }}
            />
          </label>
          <button
            style={{
              display: "block",
              padding: 10,
              backgroundColor: "rebeccapurple",
              color: "white",
              borderRadius: 5,
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              if (!nameInput) {
                return;
              }
              join(nameInput);
            }}
          >
            Join
          </button>
        </div>
      </div>
    );
  }

  if (!readyToStart) {
    return null;
  }

  if (!room) {
    return null;
  }

  return (
    <>
      <RoomComponent room={room} />
    </>
  );
};

type PlayerInfo = { id: string } & Pick<Player, "kills" | "name">;

function RoomComponent({ room }: { room: Room<MyRoomState> }) {
  const { api } = useHiber3D();
  const roomRef = useRef<Room>(null);

  const [, setIsConnecting] = useState(true);
  const [players, setPlayers] = useState<PlayerInfo[]>([]);

  useEffect(() => {
    roomRef.current = room;
    const $ = getStateCallbacks(room);

    setIsConnecting(false);

    // TODO: Try removing this
    $(room.state).players.onChange((player, index) => {
      if (room.sessionId === index) {
        return;
      }
      api?.writePlayerJoined({
        id: index,
        name: player.name,
      });
    });

    $(room.state).players.onAdd((player, sessionId) => {
      console.log("Player joined:", player, sessionId);
      setPlayers((players) => [...players, { id: sessionId, kills: player.kills, name: player.name }]);

      $(player).listen("isDead", (isDead) => {
        api?.writePlayerIsDeadChanged({
          id: sessionId,
          isLocalPlayer: room.sessionId === sessionId,
          isDead,
          name: player.name,
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
        name: player.name,
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
  }, [api, room]);

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
            <div>{player.name}</div>
            <div>{player.kills}</div>
          </div>
        ))}
    </div>
  );
}

export const App = () => (
  <Hiber3D build={{ webGPU, webGL }}>
    <GameHandler />
  </Hiber3D>
);
