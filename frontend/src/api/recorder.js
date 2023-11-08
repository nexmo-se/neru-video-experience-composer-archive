import { post } from "./api";

export const startRecorder = async (roomId, data = {}) => {
  return await post(`/api/recorder/start/${roomId}`, data);
};

export const stopRecorder = async (roomId, data = {}) => {
  return await post(`/api/recorder/stop/${roomId}`, data);
};

