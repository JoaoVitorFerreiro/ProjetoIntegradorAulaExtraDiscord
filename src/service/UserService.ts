import { randomUUID } from "node:crypto";
import { User } from "../model/user";

export class UserService {
  constructor(private armazenamento: User[]) {}

  public createUser(name: string, email: string, age: number): User {
    const id = randomUUID();
    const user = new User(id, name, email, age);

    this.armazenamento.push(user);
    return user;
  }

  public pegueTodosOsUsuarios(): User[] {
    return this.armazenamento;
  }
}
