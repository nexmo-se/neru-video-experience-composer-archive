import { post } from "./api";

/**
 * 
 * @param {*} roomId, eg. "room-0"
 * @param {*} user = { username: Alice, role }
 * ... role: "subscriber" | "publisher" | "moderator"
 * @returns 
 */
export const getCredentials = async (roomId, user) => {
  const { role, username } = user;

  if (process.env.REACT_APP_VIDEO_SESSION) {
    // set in .env.development
    return Promise.resolve({
      apiKey: process.env.REACT_APP_VIDEO_API_KEY,
      sessionId: process.env.REACT_APP_VIDEO_SESSION,
      token: process.env.REACT_APP_VIDEO_TOKEN,
    });
  }

  if (!roomId) return  Promise.reject("roomId is undefined");

  return await post(`/api/room/${roomId}/token`, { role, username });
};

