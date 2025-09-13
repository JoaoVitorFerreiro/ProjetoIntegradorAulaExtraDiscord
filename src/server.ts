import express from "express";
import { UserController } from "./controller/UserController";

export const app = express();

app.use(express.json());
UserController();

app.get("/", (req, res) => {
  res.send(new Date());
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
