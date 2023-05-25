export const startArchive = async (sessionId, data) => {
  const fetchURL = new URL(
    `/api/archive/start/${sessionId}`,
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

export const stopArchive = async (archiveId) => {
  const fetchURL = new URL(
    `/api/archive/stop/${archiveId}`,
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_URL
      : 'http://localhost:3002',
  );
  const response = await fetch(fetchURL.href);
  const json = await response.json();
  return json;
};

export const deleteArchive = async (archiveId) => {
  const fetchURL = new URL(
    `/api/archive/delete/${archiveId}`,
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_URL
      : 'http://localhost:3002',
  );
  const response = await fetch(fetchURL.href, { method: "delete" });
  const json = await response.json();
  return json;
};

export const listArchive = async () => {
  const fetchURL = new URL(
    `/api/archive/history`,
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_URL
      : 'http://localhost:3002',
  );
  const response = await fetch(fetchURL.href);
  const json = await response.json();
  return json;
};
