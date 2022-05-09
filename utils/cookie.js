export const saveGameCookie = (value) => {
  document.cookie = `game=${JSON.stringify(value)};Path=/;${
    window.location.href.match("localhost") ? "" : "SameSite=None;Secure;"
  }`;
};

export const readGameCookie = () => {
  const match = document.cookie.match(/game=([^;]+)/);
  let data = {};
  try {
    data = JSON.parse(match && match[1]);
  } catch (e) {}
  return data || {};
};

export const setApiCookie = (req, res, name, value) => {
  const isLocalhost = req.headers.host.includes("localhost");
  res.setHeader(
    "set-cookie",
    `${name}=${JSON.stringify(value)};path=/api;httponly;${
      isLocalhost ? "" : "SameSite=None;Secure;"
    }`
  );
};

export const getApiCookie = (req, name) => {
  let data;
  try {
    data = JSON.parse(req.cookies[name]);
  } catch (e) {
    data = req.cookies[name];
  }
  return data || null;
};
