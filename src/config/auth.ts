import config from "../config";

const auth = {
  secret: config.secret || "teste",
  ttl: 86400,
};

export default auth;
