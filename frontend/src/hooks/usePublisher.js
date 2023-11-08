import { useRef, useState } from "react";
import OT from "@opentok/client";

const DFT_PUBLISHER_OPTIONS = {
  insertMode: "append",
  width: "320",
  height: "240",
  fitMode: "contain",
};

export function usePublisher() {
  const publisherRef = useRef();
  const [isPublishing, setIsPublishing] = useState(false);

  const onStreamCreated = () => {
    setIsPublishing(true);
  };

  const onStreamDestroyed = ({type, reason}) => {
    console.log({type, reason});
    setIsPublishing(false);
  };

  const initPublisher = (container, publisherOptions) => {
    if (publisherRef.current) {
      console.log(" - initPublisher - already initiated");
      return;
    }
    const finalPublisherOptions = Object.assign({}, DFT_PUBLISHER_OPTIONS, publisherOptions);
    // console.log(finalPublisherOptions)

    publisherRef.current = OT.initPublisher(
      container,
      finalPublisherOptions,
      (err) => {
        if (err) {
          publisherRef.current = null;
          if (err.name === "OT_USER_MEDIA_ACCESS_DENIED") return;
          console.log(" - initPublisher err", err);
          return;
        }
      }
    );
    publisherRef.current.on({
      streamCreated: onStreamCreated,
      streamDestroyed: onStreamDestroyed,
    });
  };

  const destroyPublisher = () => {
    if (publisherRef.current) {
      publisherRef.current.destroy();
      publisherRef.current = null;
    }
  };

  const publish = (session, container, publisherOptions) => {
    if (!publisherRef.current) {
      initPublisher(container, publisherOptions);
    }
    return new Promise((resolve, reject) => {
        session.publish(publisherRef.current, (err) => {
          if (err) {
            console.log("session.publish() err", err.message);
            setIsPublishing(false);
            return reject();
          }
          setIsPublishing(true);
          resolve();
        });
    });
  };

  const unpublish = (session) => {
    if (publisherRef.current) {
      session.unpublish(publisherRef.current);
    }
  };

  return {
    publisher: publisherRef.current,
    initPublisher,
    destroyPublisher,
    isPublishing,
    publish, unpublish,
  };
}
