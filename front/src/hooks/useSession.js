import { useState, useRef, useCallback, useEffect } from 'react';
import OT from '@opentok/client';

import { useSubscriber } from './useSubscriber';

export function useSession({ container, layoutManager }) {
  
  const sessionRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [streams, setStreams] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const {
    subscribe,
    unsubscribe,
  } = useSubscriber({ layoutManager });

  const addStream = (stream) => {
    setStreams((prev) => [...prev, stream]);
  };

  const removeStream = (stream) => {
    setStreams((prev) =>
      prev.filter((prevStream) => prevStream.id !== stream.id)
    );
  };

  const onSignal = (event) => {
    let { type, data, from } = event;
    console.log('onSignal', { type, data, from });
    switch (type) {
      case 'signal:recorder:started':
        setIsRecording(true);
        break;
      case 'signal:recorder:stopped':
        setIsRecording(false);
        break;
    }
  };

  const onStreamCreated = (event) => {
    let { stream } = event;
    // let { videoType } = stream; // 'camera' 'screen'
    subscribe( stream, sessionRef.current, container ).catch(console.log);
    addStream(stream);
  };

  const onStreamDestroyed = (event) => {
    let { stream } = event;
    unsubscribe(stream, sessionRef.current);
    removeStream(stream);
  };

  const onSessionConnected = (event) => {
    setConnected(true);
  };

  const onSessionDisconnected = (event) => {
    sessionRef.current = null;
    setConnected(false);
    setStreams([]);
  };
  
  const createSession = useCallback(async ({ apiKey, sessionId, token }) => {
    if (sessionRef.current) {
      // console.log('[UseSession] - createSession already connected');
      return;
    }
    if (!apiKey) {
      throw new Error('[UseSession] - createSession Missing apiKey');
    }
    if (!sessionId) {
      throw new Error('[UseSession] - createSession Missing sessionId');
    }
    if (!token) {
      throw new Error('[UseSession] - createSession Missing token');
    }

    sessionRef.current = OT.initSession(apiKey, sessionId);

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
          console.log('[UseSession] - createSession err', err);
          sessionRef.current = null;
          reject(err);
        } else if (!err) {
          // console.log('[UseSession] - createSession done');
          setConnected(true);
          resolve(sessionRef.current);
        }
      });
    });
  }, [
    onStreamCreated,
    onStreamDestroyed, 
    onSessionConnected,
    onSessionDisconnected,
  ]);

  const disconnectSession = () => {
    if (sessionRef.current && connected) {
      sessionRef.current.disconnect();
      setConnected(false);
    }
    sessionRef.current = null;
  };

  return {
    session: sessionRef.current,
    connected,
    createSession,
    disconnectSession,
    streams,
    isRecording,
    setIsRecording,
  };
}
