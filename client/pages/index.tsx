import { useSockets } from "../context/socket.context";
import RoomsContainer from "../containers/Rooms";
import MessagesContainer from "../containers/Messages";
import React from "react";
import styles from '../styles/Home.module.css'
export default function Home() {
  const {  setUsername, username } = useSockets();
  const usernameRef = React.useRef(null);
  console.log(username);

  const handleSetUsername = () => {
    const value = usernameRef.current.value;
    console.log(usernameRef);

    if (!value) {
      return;
    }

    setUsername(value);
    localStorage.setItem("username", value);
  };

  return (
    <div>
      {!username && (
        <div className={styles.usernameWrapper}>
          <div className={styles.usernameInner}></div>
          <input ref={usernameRef} placeholder="Username" />
          <button onClick={handleSetUsername}>Start</button>
        </div>
      )}
      <div className={styles.container}>
        <RoomsContainer />
        <MessagesContainer />
      </div>
    </div>
  );
}
