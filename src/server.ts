import express from "express";
import path from "path";
import { BarbeariaController } from "./controller/BarbeariaController";

export const app = express();

app.use(express.json());

// Servir arquivos estáticos da pasta view
app.use(express.static(path.join(__dirname, "view")));

// Configurar rotas da barbearia
const barbeariaRouter = BarbeariaController();
app.use(barbeariaRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "index.html"));
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
