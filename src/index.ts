import app from "./app";
import { startMongooseConnection } from "./db/mongoose";

startMongooseConnection();

app.listen(app.get("port"), () => {
  console.log(`Server is up on port ${app.get("port")}`);
});
