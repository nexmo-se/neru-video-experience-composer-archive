import { useCallback, useRef, useState, useContext, useEffect } from 'react';
import OT from '@opentok/client';

const defaultPublisherOptions = {
  insertMode: 'append',
  width: '100%',
  height: '100%',
  // style: {
  //   buttonDisplayMode: 'on',
  //   nameDisplayMode: 'on',
  // },
  // showControls: true,
  // fitMode: 'contain',
};

export function usePublisher() {

  const [isPublishing, setIsPublishing] = useState(false);
  const [pubInitialised, setPubInitialised] = useState(false);

  const publisherRef = useRef();

  const streamCreatedListener = useCallback((event) => {
    setIsPublishing(true);
  }, []);

  const streamDestroyedListener = useCallback(() => {
    setIsPublishing(false);
  }, []);

  const videoElementCreatedListener = useCallback(({ element }) => {
    setPubInitialised(true);
  }, []);

  const destroyedListener = useCallback(() => {
    publisherRef.current = null;
    setPubInitialised(false);
    setIsPublishing(false);
  }, []);

  const accessAllowedListener = useCallback(async () => {
  }, []);

  const accessDeniedListener = useCallback(() => {
    publisherRef.current = null;
    setPubInitialised(false);
  }, []);

  const initPublisher = useCallback(
    ({ container, publisherOptions }) => {
      if (publisherRef.current) {
        // console.log('[UsePublisher] - initPublisher - already initiated');
        return;
      }

      const finalPublisherOptions = Object.assign({}, defaultPublisherOptions, publisherOptions);
      // console.log('[UsePublisher] - finalPublisherOptions', finalPublisherOptions);
      
      publisherRef.current = OT.initPublisher(
        container,
        finalPublisherOptions,
        (err) => {
          if (err) {
            console.log('[UsePublisher] - initPublisher err', err);
            publisherRef.current = null;
          } else {
            // console.log('[UsePublisher] - initPublisher done');
          }
        }
      );

      publisherRef.current.on('accessAllowed', accessAllowedListener);
      publisherRef.current.on('accessDenied', accessDeniedListener);
      publisherRef.current.on('streamCreated', streamCreatedListener);
      publisherRef.current.on('streamDestroyed', streamDestroyedListener);
      publisherRef.current.on('videoElementCreated', videoElementCreatedListener);
      publisherRef.current.on('destroyed', destroyedListener);

      setPubInitialised(true);
    },
    [
      accessAllowedListener,
      accessDeniedListener,
      streamCreatedListener,
      streamDestroyedListener,
    ]);

  const destroyPublisher = () => {
    if (publisherRef.current && pubInitialised) {
      publisherRef.current.destroy();
    }
  };

  const publish = useCallback(
    ({ container, session, publisherOptions }) => {

      if (!publisherRef.current) {
        initPublisher({ container, publisherOptions });
      }

      if (session && publisherRef.current && !isPublishing) {
        return new Promise((resolve, reject) => {
          session.publish(publisherRef.current, (err) => {
            if (err) {
              console.log('[UsePublisher] - session.publish err', err);
              return reject(err);
            } else {
              // console.log('[UsePublisher] - session.publish done');
              setIsPublishing(true);
              resolve(publisherRef.current);
            }
          });
        });
      }
    },
    [
      initPublisher,
    ]
  );

  const unpublish = ({ session }) => {
    if (publisherRef.current && isPublishing) {
      session.unpublish(publisherRef.current);
      setIsPublishing(false);
    }
    publisherRef.current = null;
  };

  // useEffect(() => {
  //   return () => {
  //   }
  // }, []);

  return {
    publisher: publisherRef.current,
    initPublisher,
    publish,
    pubInitialised,
    isPublishing,
    unpublish,
    destroyPublisher,
  };
}
