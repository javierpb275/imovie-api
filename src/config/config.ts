export default {
  DB: {
    URI: process.env.MONGODB_URI || "somedburl",
    USER: process.env.MONGODB_USER || "somedbuser",
    PASSWORD: process.env.MONGODB_PASSWORD || "somedbpassword",
    NAME: process.env.MONGODB_NAME || "somedbname",
  },
  AUTH: {
    ACCESS_TOKEN_SECRET:
      process.env.ACCESS_TOKEN_SECRET || "someaccesstokensecret",
    REFRESH_TOKEN_SECRET:
      process.env.REFRESH_TOKEN_SECRET || "somerefreshtokensecret",
    ACCESS_TOKEN_EXPIRATION: "1h",
    REFRESH_TOKEN_EXPIRATION: "30d",
  },
};
