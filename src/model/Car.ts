export class Car {
  // função para criar um usuário
  constructor(
    private id: string,
    private placa: string,
    private modelo: string,
    private vaga: string,
    private horarioChegada: Date,
    private horarioSaida: Date
  ) {}

  public getPlaca() {
    return this.placa;
  }

  public setHorarioSaida(horarioSaida: Date) {
    this.horarioSaida = horarioSaida;
  }
}
