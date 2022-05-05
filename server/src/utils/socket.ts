import { Server, Socket } from "socket.io";
import { log } from "./logger";
import { nanoid } from "nanoid";

const events = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
    JOIN_ROOM: "JOIN_ROOM",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOM_MESSAGE: "ROOM_MESSAGE",
  },
};
const rooms: Record<string, { name: string }> = {};
const socket = ({ io }: { io: Server }) => {
  log.info("Sockets Enabled");

  io.on(events.connection, (socket: Socket) => {
    log.info("user connected " + socket.id);

    /*
      When a user created a new room
    */
    socket.on(events.CLIENT.CREATE_ROOM, ({ roomName }) => {
      console.log(roomName);
      // create roomId
      const roomId = nanoid();
      // add a room to rooms object
      rooms[roomId] = {
        name: roomName,
      };
      // socket.join
      socket.broadcast.emit(events.SERVER.ROOMS, rooms);

      // emit back to the room creator with all the rooms
      socket.emit(events.SERVER.ROOMS, rooms);
      // emit event back to the room creator saying they have joined the room
      socket.emit(events.SERVER.JOINED_ROOM, roomId);
    });

    /*
      When a user sends a new message
    */
    socket.on(
      events.CLIENT.SEND_ROOM_MESSAGE,
      ({ roomId, message, username }) => {
        const date = new Date();
        socket.to(roomId).emit(events.SERVER.ROOM_MESSAGE, {
          message,
          username,
          time: `${date.getHours()} : ${date.getMinutes()}`,
        });
      }
    );

    // When a user joins a room
    socket.on(events.CLIENT.JOIN_ROOM, (roomId) => {
      socket.join(roomId);
      socket.emit(events.SERVER.JOINED_ROOM, roomId);
    });
  });
};

export default socket;
