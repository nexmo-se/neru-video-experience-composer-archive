import { post, get } from "./api";

export const listArchive = async (sessionId) => {
  if (!sessionId) return null;
  return await get(`/api/archive/history/${sessionId}`);
};

export const startArchive = async (sessionId) => {
  if (!sessionId) return null;
  return await post(`/api/archive/start/${sessionId}`);
};

export const stopArchive = async (archiveId, sessionId) => {
  if (!archiveId || !sessionId) return null;
  return await post(`/api/archive/stop/${archiveId}`, {sessionId});
};

export const deleteArchive = async (archiveId) => {
  if (!archiveId) return null;
  return await post(`/api/archive/delete/${archiveId}`);
};

