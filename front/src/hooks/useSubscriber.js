import { useState } from 'react';

const defaultSubscriberOptions = {
  insertMode: 'append',
  width: '100%',
  height: '100%',
  // style: {
  //   buttonDisplayMode: 'on',
  //   nameDisplayMode: 'on',
  // },
  // showControls: true,
  // fitMode: 'contain'
};

export function useSubscriber({ layoutManager }) {
  const [subscribers, setSubscribers] = useState([]);

  const addSubscriber = (subscriber) => {
    if (!subscriber.stream || !subscriber.streamId) return;

    let _connectionData = subscriber.stream.connection.data;
    let connectionData = JSON.parse(_connectionData);
    if (connectionData && "EC" === connectionData.type) {
      layoutManager.clearBig(subscriber.element);
      subscriber.element.classList.add('OT_big');
    }

    setSubscribers((prev) => [...prev, subscriber]);
    layoutManager.layout();
  };

  const removeSubscriber = (subscriber) => {
    setSubscribers((prev) =>
      prev.filter((prevSubscriber) => prevSubscriber.id !== subscriber.id)
    );
    layoutManager.layout();
  };

  const subscribe = async ( stream, session, container ) => {
    if (!session || !container) {
      return;
    }
    let finalOptions = Object.assign({}, defaultSubscriberOptions);
    return new Promise((resolve, reject) => {
      let subscriber = session.subscribe(
        stream,
        container,
        finalOptions, 
        (err) => {
          if (err) {
            // console.log('[useSubscriber] - session.subscribe err');
            resolve(null);
          } else {
            // console.log('[useSubscriber] - session.subscribe done');
            addSubscriber(subscriber);
            resolve(subscriber);
          }
        }
      );
      // subscriber.on("x", fun);
    });
  };

  const unsubscribe = async ( stream, session ) => {
    if (!session) {
      return;
    }
    return new Promise((resolve, reject) => {
      session.getSubscribersForStream(stream).forEach((subscriber) => {
        if (subscriber) session.unsubscribe(subscriber);
        removeSubscriber(subscriber);
      });
    });
  };

  return {
    subscribers,
    subscribe,
    unsubscribe,
  };
}
