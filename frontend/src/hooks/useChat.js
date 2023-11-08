import { useState, useCallback } from "react";

const SINGAL_TYPE_CHAT = "chat";

export function useChat({ session }) {
  const [messages, setMessages] = useState([]);

  const addMessages = (data) => {
    setMessages((prev) => [...prev, data]);
  };

  const onSignalChat = useCallback(({ type, data }) => {
    if (type === `signal:${SINGAL_TYPE_CHAT}`) {
      const { text, username } = JSON.parse(data);
      addMessages({text, from: `${username || "?"}`});
    }
  }, [addMessages]);

  const sendSignalChat = ({text, username = ""}) => {
    if (!session || session.currentState !== "connected") return;

    return new Promise((resolve, reject) => {
      // Signaling of anything other than Strings is deprecated.
      session.signal({
        type: SINGAL_TYPE_CHAT, 
        data: JSON.stringify({ text, username }),
      }, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  };

  return {
    messages,
    addMessages,
    onSignalChat,
    sendSignalChat
  };
}
