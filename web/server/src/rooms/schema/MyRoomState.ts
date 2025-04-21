import { MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("number") x: number;
  @type("number") z: number;
  @type("number") rotX: number;
  @type("number") rotY: number;
  @type("number") rotZ: number;
  @type("number") rotW: number;
}

export class Bullet extends Schema {
  @type("number") owner: number;
  @type("number") time: number;
  @type("number") originX: number;
  @type("number") originZ: number;
  @type("number") direction: number;
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
