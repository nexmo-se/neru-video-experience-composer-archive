import { useRef, useContext, useState, useCallback, useEffect } from "react";
import OT from "@opentok/client";
import { RoomContext } from "../context/RoomContext";
import { useSubscriber } from "./useSubscriber";
import { useLayoutManager } from "./useLayoutManager";

export function useSession({ containerName }) {
  const sessionRef = useRef(null);

  const {
    setSession,
    setConnection,
    onSignalChat,
    onSignalRecorder,
    onSignalArchive,
  } = useContext(RoomContext);

  const [connected, setConnected] = useState(false);
  const [streams, setStreams] = useState([]);
  
  const {
    subscribe,
    unsubscribe,
  } = useSubscriber();

  const {
    layout,
    layoutContainer,
  } = useLayoutManager({
    containerName
  });

  const addStream = (stream) => {
    setStreams((prev) => [...prev, stream]);
  };

  const removeStream = (stream) => {
    setStreams((prev) =>
      prev.filter((prevStream) => prevStream.id !== stream.id)
    );
  };

  const onStreamCreated = ({ stream }) => {
    let {videoType, connection} = stream;
    console.log("onStreamCreated", stream.id, videoType, connection?.data);
    var subContainer = createElementChild(`subscriber_${stream.id}`);
    subscribe(stream, sessionRef.current, subContainer).then(() => {
      subContainer.style.display = "block";
    }).catch(console.log);

    addStream(stream);
  };

  const onStreamDestroyed = (event) => {
    let { stream } = event;
    unsubscribe(stream, sessionRef.current);
    removeStream(stream);
  };

  const onSessionConnected = (event) => {
    setConnected(true);
    setConnection(event.target.connection);
  };

  const onSessionDisconnected = () => {
    setConnected(false);
    setStreams([]);
    setConnection(null);
  };

  const onSignal = (event) => {
    let {data, from, type} = event
    console.log({data, from, type});
    onSignalChat(event);
    onSignalArchive(event);
    onSignalRecorder(event);
  };
  
  const connectSession = useCallback(({ apiKey, sessionId, token }) => {
    if (sessionRef.current) {
      console.log(" - connectSession already connected");
      return;
    }
    if (!apiKey || !sessionId || !token) {
      throw new Error(" - connectSession Missing apiKey, sessionId or token");
    }
    sessionRef.current = OT.initSession(apiKey, sessionId);
    
    setSession(sessionRef.current);

    sessionRef.current.on({
      streamCreated: onStreamCreated,
      streamDestroyed: onStreamDestroyed,
      sessionConnected: onSessionConnected,
      sessionDisconnected: onSessionDisconnected,
      signal: onSignal,
    });

    return new Promise((resolve, reject) => {
      sessionRef.current.connect(token, (err) => {
        if (err) {
          console.log(" - session.connect() err", err.message);
          sessionRef.current = null;
          return reject();
        }
        setConnected(true);
        setConnection(sessionRef.current.connection.id);
        resolve();
      });
    });
  }, [
    onStreamCreated,
    onStreamDestroyed, 
    onSessionConnected,
    onSessionDisconnected,
    onSignal,
  ]);

  const disconnectSession = () => {
    if (sessionRef.current && connected) {
      sessionRef.current.disconnect();
      sessionRef.current = null;
      setConnected(false);
      setConnection(null);
    }
  };

  const createElementChild = (id) => {
    const el = document.createElement("div");
    el.id = id;
    el.style.display = "none";
    const container = document.getElementById(containerName);
    container.appendChild(el);
    return el;
  };

  useEffect(() => {
    if (streams.length) {
      layout(streams);
    }
  }, [streams, layoutContainer]);

  return {
    session: sessionRef.current,
    connected,
    connectSession,
    disconnectSession,
    streams,
  };
}
