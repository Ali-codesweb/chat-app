import { useRef } from "react";
import { useSockets } from "../context/socket.context";
import Events from "../config/events";
import events from "../config/events";
const RoomsContainer = () => {
  const { socket, rooms, roomId } = useSockets();
  const newRoomRef = useRef(null);
  function handleCreateRoom() {
    const roomName = newRoomRef.current.value;
    if (!String(roomName).trim()) return;
    socket.emit(Events.CLIENT.CREATE_ROOM, { roomName });

    newRoomRef.current.value = "";
  }

  const handleJoinRoom = (key) => {
    if (key == roomId) return;
    socket.emit(events.CLIENT.JOIN_ROOM, key);
  };

  return (
    <>
      <input placeholder="Room name" ref={newRoomRef} />
      <button onClick={handleCreateRoom}>CREATE ROOM</button>

      {Object.keys(rooms).map((key) => {
        return (
          <div key={key}>
            <button
              disabled={key == roomId}
              title={`Join ${rooms[key].name}`}
              onClick={() => {
                handleJoinRoom(key);
              }}
            >
              {rooms[key].name}
            </button>
          </div>
        );
      })}
    </>
  );
};
export default RoomsContainer;
