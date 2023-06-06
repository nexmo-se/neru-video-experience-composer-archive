import { 
  createContext, 
  // useRef, 
  useState, 
  // useMemo, 
  useCallback, 
  // useEffect 
} from "react";

export const MessageContext = createContext();

export function MessageProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const signal = (session, type, data) => {
    return new Promise((resolve, reject) => {
      const payload = JSON.parse(JSON.stringify({ type, data }));
      session.signal(payload, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

  };

  const sendMsg = async (session, text, from) => {
    text = text.replace(/^\s+|\s+$/g, "");
    if (text.length <= "") return;
    await signal(session, 'message', JSON.stringify({ text, from }));
  };

  const msgListener = useCallback((data) => {
    setMessages((prev) => {
      const message = JSON.parse(data);
      console.log(message)
      return [ ...prev, message ];
    });
  }, []);

  return (
    <MessageContext.Provider value={{
      messages,
      sendMsg,
      msgListener
    }}
    >
      { children }
    </MessageContext.Provider>
  );
}
