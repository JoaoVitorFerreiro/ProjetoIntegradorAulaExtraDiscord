import { randomUUID } from "node:crypto";
import { Car } from "../model/Car";

export class CarService {
  constructor(private armazenamento: Car[]) {}

  public createCar(placa: string, modelo: string): Car {
    const id = randomUUID();
    const carro = new Car(id, placa, modelo, modelo, new Date(), new Date());

    this.armazenamento.push(carro);
    return carro;
  }

  public saidaCarro(dataHorarioSaida: Date, placa: string): Car | undefined {
    const carro = this.armazenamento.find((car) => car.getPlaca() === placa);
    if (carro) {
      carro.setHorarioSaida(dataHorarioSaida);
    }
    return carro;
  }
}
