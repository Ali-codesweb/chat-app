import React, { createContext, useContext, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "../config/default";
import events from "../config/events";

const socket = io(SOCKET_URL);

interface Context {
  socket: Socket;
  username?: string;
  setUsername: Function;
  roomId?: string;
  rooms: any;
  messages: { message: string; time: string; username: string }[];
  setMessages: Function;
}

const SocketContext = createContext<Context>({
  socket,
  setUsername: () => false,
  rooms: {},
  messages: [],
  setMessages: () => false,
});
function SocketsProvider(props: any) {
  const [username, setUsername] = React.useState("");
  const [rooms, setRooms] = React.useState({});
  const [roomId, setRoomId] = React.useState("");
  const [messages, setMessages] = React.useState([]);

  useEffect(()=>{
    window.onfocus = ()=>{
      document.title = 'Chat app'
    }
  },[])

  socket.on(events.SERVER.ROOMS, (value) => {
    setRooms(value);
  });

  socket.on(events.SERVER.JOINED_ROOM, (value) => {
    setRoomId(value);
    setMessages([]);
  });
  socket.on(events.SERVER.ROOM_MESSAGE, ({ message, username, time }) => {

    if(!document.hasFocus()){
      document.title='New message....'
    }

    setMessages([...messages, { message, username, time }]);
  });
  return (
    <SocketContext.Provider
      value={{
        socket,
        setUsername,
        username,
        rooms,
        roomId,
        messages,
        setMessages,
      }}
      {...props}
    />
  );
}

export const useSockets = () => useContext(SocketContext);

export default SocketsProvider;
