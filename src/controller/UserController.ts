import { User } from "../model/user";
import { app } from "../server";
import { UserService } from "../service/UserService";

export function UserController() {
  const listaUsuarios: User[] = [];
  const userService = new UserService(listaUsuarios);

  app.post("/usuarios", (req, res) => {
    const { name, email, age } = req.body;

    const user = userService.createUser(name, email, age);
    res.status(201).json(user);
  });

  app.get("/usuarios", (req, res) => {
    const usuarios = userService.pegueTodosOsUsuarios();
    res.status(200).json(usuarios);
  });
}
