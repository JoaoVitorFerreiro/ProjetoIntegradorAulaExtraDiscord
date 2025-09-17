import express from "express";
import path from "path";
import { BarbeariaController } from "./controller/BarbeariaController";

export const app = express();

app.use(express.json());

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(process.cwd(), "public")));

// Rotas da barbearia
const barbeariaRouter = BarbeariaController();
app.use(barbeariaRouter);

// Rota inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
