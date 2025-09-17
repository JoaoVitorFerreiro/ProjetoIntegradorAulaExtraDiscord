export class Barbeiro {
  constructor(
    private nome: string,
    private diasTrabalho: string[],
    private horaInicio: string,
    private horaFim: string
  ) {}

  public getNome(): string {
    return this.nome;
  }

  public getDiasTrabalho(): string[] {
    return this.diasTrabalho;
  }

  public getHoraInicio(): string {
    return this.horaInicio;
  }

  public getHoraFim(): string {
    return this.horaFim;
  }
}