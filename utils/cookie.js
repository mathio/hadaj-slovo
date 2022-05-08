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
