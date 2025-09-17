export class Cliente {
  constructor(
    private nome: string,
    private telefone: string
  ) {}

  public getNome(): string {
    return this.nome;
  }

  public getTelefone(): string {
    return this.telefone;
  }
}