import { post, get } from "./api";

export const startArchive = async (roomId) => {
  if (!roomId) return null;
  return await post(`/api/room/${roomId}/archive/start`);
};

export const stopArchive = async (roomId) => {
  if (!roomId) return null;
  return await post(`/api/room/${roomId}/archive/stop`);
};

export const getInfo = async (roomId) => {
  if (!roomId) return null;
  return await get(`/api/room/${roomId}/info`);
};
