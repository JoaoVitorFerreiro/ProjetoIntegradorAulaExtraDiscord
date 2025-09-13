export class User {
  // função para criar um usuário
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private age: number
  ) {}
  public getId(): string {
    return this.id;
  }
  public getName(): string {
    return this.name;
  }
  public getEmail(): string {
    return this.email;
  }
  public getAge(): number {
    return this.age;
  }
}
