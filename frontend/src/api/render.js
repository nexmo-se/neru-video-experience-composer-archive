import { post, get } from "./api";

export const listRender = async (sessionId) => {
  if (!sessionId) return null;
  return await get(`/api/render/history/${sessionId}`);
};

export const startRender = async (sessionId, data) => {
  if (!sessionId) return null;
  return await post(`/api/render/start/${sessionId}`, data);
};

export const stopRender = async (renderId) => {
  if (!renderId) return null;
  return await post(`/api/render/stop/${renderId}`);
};
