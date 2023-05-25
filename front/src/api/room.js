
export const startRecorder = async (roomId, data) => {
  const fetchURL = new URL(
    `/api/room/${roomId}/recorder/start`,
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_URL
      : 'http://localhost:3002',
  );
  const response = await fetch(fetchURL.href, {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
  });
  const json = await response.json();
  return json;
};


export const stopRecorder = async (roomId, data) => {
  const fetchURL = new URL(
    `/api/room/${roomId}/recorder/stop`,
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_URL
      : 'http://localhost:3002',
  );
  const response = await fetch(fetchURL.href, {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
  });
  const json = await response.json();
  return json;
};
