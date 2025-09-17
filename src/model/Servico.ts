export class Servico {
  constructor(
    private nome: string,
    private preco: number,
    private tempoEstimado: number
  ) {}

  public getNome(): string {
    return this.nome;
  }

  public getPreco(): number {
    return this.preco;
  }

  public getTempoEstimado(): number {
    return this.tempoEstimado;
  }
}