const REACT_APP_URL = process.env.REACT_APP_URL || "http://localhost:3002";

export async function get(path, options = {}) {
  try {
    options.method = "get";
    const data = await base(path, options);
    return data;
  } catch (error) {
    throw error;
  }
}

export async function post(path, body = {}, options = {}) {
  try {
    options.body = JSON.stringify(body);
    options.method = "post";
    const data = await base(path, options);
    return data;
  } catch (error) {
    throw error;
  }
}

async function base(path, options = {}) {
  const username = "abc"; // localStorage.getItem("username") || "abc";
  const password = localStorage.getItem("password") || "123";
  const token = btoa(`${username}:${password}`);
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
  options.headers = { ...headers, ...options.headers };
  try {
    const url = new URL(path, REACT_APP_URL);
    const response = await fetch(url.href, options);
    if (!response.ok) {
      throw new Error("response not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("[fetch]", error.message);
    throw Error("failed to fetch");
  }
}
