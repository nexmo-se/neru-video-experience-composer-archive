import { useRef, useContext, useState, useEffect } from "react";
import initLayoutContainer from "opentok-layout-js";
import { RoomContext } from "../context/RoomContext";

const OPTIONS = {
  bigFirst: false,
  alignItems: "start",
};

export function useLayoutManager({ containerName }) {
  const resizeTimerRef = useRef();

  const {
    session,
    connection,
  } = useContext(RoomContext);

  const [layoutContainer, setLayoutContainer] = useState(null);

  const layout = (streams) => {
    if (!streams || !streams.length) return;
    // 
    var videoDimensions = [];
    var bigFlag = null;
    streams.forEach((stream, index) => {
      let {videoType, connection} = stream;
      let {data: dataStr} = connection;
      let connData = JSON.parse(dataStr);
      bigFlag = (connData && connData.type && connData.type === "EC")
                  || videoType === "screen" ? index : bigFlag;
      // only the last screen stream or EC stream is in big 
      videoDimensions.push({
        width: stream.videoDimensions.width,
        height: stream.videoDimensions.height,
        big: false,
        fixedRatio: false,
      });
    });
    if (bigFlag !== null) {
      videoDimensions[bigFlag] = {
        ...videoDimensions[bigFlag], 
        big: true,
        fixedRatio: true,
      };
    } else {
      videoDimensions[videoDimensions.length - 1] = {
        ...videoDimensions[videoDimensions.length - 1], 
        big: true,
        fixedRatio: true,
      };
    }

    // 
    const { boxes } = layoutContainer.getLayout(videoDimensions);

    // 
    streams.forEach((stream, index) => {
      if (isLocalStream(stream)) {
        let _publisher = session.getPublisherForStream(stream);
        if (_publisher) {
          updateElementStyle(_publisher.element, boxes[index]);
        }
      }
      else {
        session.getSubscribersForStream(stream).forEach((_subscriber) => {
          updateElementStyle(_subscriber.element, boxes[index]);
        });
      }
    });
  };

  const isLocalStream = (stream) => {
    return (connection && stream.connection.id == connection.id);
  };

  const updateElementStyle = (element, dimensions) =>{
    const { width, height, top, left } = dimensions;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.position = "absolute";
    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
    element.style.overflow = "hidden";
    element.classList.add("OT-layout");
  };

  useEffect (() => {
    const container = document.getElementById(containerName);
    if (container) setLayoutContainer(initLayoutContainer({
      containerWidth: container.clientWidth,
      containerHeight: container.clientHeight,
      ...{OPTIONS}
    }));

    window.onresize = () => {
      clearTimeout(resizeTimerRef.current);

      resizeTimerRef.current = setTimeout(function () {
        const container = document.getElementById(containerName);
        if (container) setLayoutContainer(initLayoutContainer({
          containerWidth: container.clientWidth,
          containerHeight: container.clientHeight,
          ...{OPTIONS}
        }));
      }, 100);
    };

    return (() => {
      clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = null;
    });
  }, []);

  return {
    layout,
    layoutContainer,
  };
}
