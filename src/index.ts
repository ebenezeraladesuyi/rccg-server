import express, { Application } from "express";
import dbConfig from "./config/db";
import appConfig from "./app";

const app: Application = express();
// const app = express();
appConfig(app)
dbConfig()

const PORT = 2021;

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
