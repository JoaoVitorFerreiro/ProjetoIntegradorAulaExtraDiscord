import { Cliente } from "./Cliente";
import { Barbeiro } from "./Barbeiro";
import { Servico } from "./Servico";

export class Agendamento {
  constructor(
    private cliente: Cliente,
    private barbeiro: Barbeiro,
    private servico: Servico,
    private dataHora: Date
  ) {}

  public getCliente(): Cliente {
    return this.cliente;
  }

  public getBarbeiro(): Barbeiro {
    return this.barbeiro;
  }

  public getServico(): Servico {
    return this.servico;
  }

  public getDataHora(): Date {
    return this.dataHora;
  }
}