export const startRender = async (sessionId, data) => {
  const fetchURL = new URL(
    `/api/ec/start/${sessionId}`,
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

export const stopRender = async (renderId) => {
  const fetchURL = new URL(
    `/api/ec/stop/${renderId}`,
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_URL
      : 'http://localhost:3002',
  );
  const response = await fetch(fetchURL.href);
  const json = await response.json();
  return json;
};

export const listRender = async (sessionId) => {
  const fetchURL = new URL(
    `/api/ec/history/${sessionId}`,
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_URL
      : 'http://localhost:3002',
  );
  const response = await fetch(fetchURL.href);
  const json = await response.json();
  return json;
};
