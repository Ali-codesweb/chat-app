import { useRef } from "react";
import events from "../config/events";
import { useSockets } from "../context/socket.context";

const MessagesContainer = () => {
  const { messages, roomId, username, socket, setMessages } = useSockets();
  if (!roomId) return <div />;
  const newMessageRef = useRef(null);
  const handleSendMessage = () => {
    const message = newMessageRef.current.value;

    if (!String(message).trim()) return;

    socket.emit(events.CLIENT.SEND_ROOM_MESSAGE, { roomId, message, username });
    const date = new Date();
    setMessages([
      ...messages,
      {
        username: "You",
        message,
        time: `${date.getHours()} : ${date.getMinutes()}`,
      },
    ]);
    newMessageRef.current.value = ''
  };
  return (
    <>
      <h1>This is the messages container</h1>
      {messages.map(({message}, index) => {
        return <p key={index}>{message}</p>;
      })}

      <div>
        <textarea
          placeholder="Tell us what you are thinking"
          name=""
          id=""
          rows={1}
          ref={newMessageRef}
        ></textarea>
        <button onClick={handleSendMessage}>SEND</button>
      </div>
    </>
  );
};
export default MessagesContainer;
