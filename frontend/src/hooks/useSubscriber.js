import { useState } from "react";

const defaultSubscriberOptions = {
  insertMode: "append",
};

export function useSubscriber() {

  const [subscribers, setSubscribers] = useState([]);

  const addSubscriber = (subscriber) => {
    if (!subscriber.stream || !subscriber.streamId) return;
    setSubscribers((prev) => [...prev, subscriber]);
  };

  const removeSubscriber = (subscriber) => {
    setSubscribers((prev) =>
      prev.filter((prevSubscriber) => prevSubscriber.id !== subscriber.id)
    );
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
            resolve(null);
          } else {
            addSubscriber(subscriber);
            resolve(subscriber);
          }
        }
      );
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
