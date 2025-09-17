import { Cliente } from "../model/Cliente";
import { Servico } from "../model/Servico";
import { Barbeiro } from "../model/Barbeiro";
import { Agendamento } from "../model/Agendamento";

export class BarbeariaService {
  private listaClientes: Cliente[];
  private listaServicos: Servico[];
  private listaBarbeiros: Barbeiro[];
  private listaAgendamentos: Agendamento[];

  constructor() {
    this.listaClientes = [];
    this.listaServicos = [];
    this.listaBarbeiros = [];
    this.listaAgendamentos = [];
    this.inicializarDados();
  }

  private inicializarDados(): void {
    this.listaServicos.push(new Servico("Corte Simples", 25.0, 30));
    this.listaServicos.push(new Servico("Corte + Barba", 35.0, 45));
    this.listaServicos.push(new Servico("Barba Completa", 20.0, 20));
    this.listaServicos.push(new Servico("Corte Social", 30.0, 40));

    this.listaBarbeiros.push(new Barbeiro("João", ["segunda", "terca", "quarta", "quinta", "sexta", "sabado"], "08:00", "18:00"));
    this.listaBarbeiros.push(new Barbeiro("Carlos", ["terca", "quarta", "quinta", "sexta"], "09:00", "17:00"));
    this.listaBarbeiros.push(new Barbeiro("Miguel", ["sabado", "domingo"], "08:00", "16:00"));
  }

  public buscarCliente(telefone: string): Cliente | null {
    return this.listaClientes.find(cliente => cliente.getTelefone() === telefone) || null;
  }

  public cadastrarCliente(nome: string, telefone: string): Cliente | null {
    if (this.buscarCliente(telefone)) {
      return null;
    }
    const novoCliente = new Cliente(nome, telefone);
    this.listaClientes.push(novoCliente);
    return novoCliente;
  }

  public obterTodosServicos(): Servico[] {
    return this.listaServicos;
  }

  public obterTodosBarbeiros(): Barbeiro[] {
    return this.listaBarbeiros;
  }

  public obterServicoPorIndice(indice: number): Servico | null {
    return this.listaServicos[indice] || null;
  }

  public obterBarbeiroPorIndice(indice: number): Barbeiro | null {
    return this.listaBarbeiros[indice] || null;
  }

  public verificarDisponibilidade(barbeiro: Barbeiro, dataHora: Date, servico: Servico): { disponivel: boolean, mensagem: string } {
    return { disponivel: true, mensagem: "Horário disponível" };
  }

  private parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  public obterHorariosDisponiveis(barbeiro: Barbeiro, data: Date, servico: Servico): string[] {
    return [
      "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
      "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
      "16:00", "16:30", "17:00", "17:30"
    ];
  }

  private formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  public criarAgendamento(cliente: Cliente, barbeiro: Barbeiro, servico: Servico, dataHora: Date): Agendamento | null {
    const novoAgendamento = new Agendamento(cliente, barbeiro, servico, dataHora);
    this.listaAgendamentos.push(novoAgendamento);
    return novoAgendamento;
  }

  public obterAgendamentosCliente(telefone: string): Agendamento[] {
    return this.listaAgendamentos.filter(agendamento => 
      agendamento.getCliente().getTelefone() === telefone
    );
  }

  public obterTodosAgendamentos(): Agendamento[] {
    return this.listaAgendamentos;
  }

  public obterRelatorioFaturamento(): any {
    const relatorio: any = {};
    
    this.listaAgendamentos.forEach(agendamento => {
      const nomeBarbeiro = agendamento.getBarbeiro().getNome();
      const valorServico = agendamento.getServico().getPreco();
      
      if (!relatorio[nomeBarbeiro]) {
        relatorio[nomeBarbeiro] = {
          totalAtendimentos: 0,
          faturamentoTotal: 0
        };
      }
      
      relatorio[nomeBarbeiro].totalAtendimentos++;
      relatorio[nomeBarbeiro].faturamentoTotal += valorServico;
    });
    
    return relatorio;
  }
}