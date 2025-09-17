import { BarbeariaService } from "../service/BarbeariaService";
import { Request, Response, Router } from "express";

export function BarbeariaController() {
  const router = Router();
  const barbeariaService = new BarbeariaService();

  // Rota para cadastrar cliente
  router.post("/user", (req: Request, res: Response) => {
    try {
      const { nome, telefone } = req.body;

      if (!nome || !telefone) {
        return res
          .status(400)
          .json({ erro: "Nome e telefone são obrigatórios" });
      }

      const cliente = barbeariaService.cadastrarCliente(nome, telefone);
      if (!cliente) {
        return res.status(400).json({ erro: "Telefone já cadastrado!" });
      }

      res.status(201).json({
        mensagem: "Cliente cadastrado com sucesso!",
        cliente: {
          nome: cliente.getNome(),
          telefone: cliente.getTelefone(),
        },
      });
    } catch (error) {
      res.status(500).json({ erro: "Erro interno do servidor" });
    }
  });

  // Rota para fazer login (buscar cliente)
  router.post("/login", (req: Request, res: Response) => {
    try {
      const { telefone } = req.body;

      if (!telefone) {
        return res.status(400).json({ erro: "Telefone é obrigatório" });
      }

      const cliente = barbeariaService.buscarCliente(telefone);
      if (!cliente) {
        return res.status(404).json({ erro: "Telefone não encontrado!" });
      }

      res.status(200).json({
        mensagem: "Login realizado com sucesso!",
        cliente: {
          nome: cliente.getNome(),
          telefone: cliente.getTelefone(),
        },
      });
    } catch (error) {
      res.status(500).json({ erro: "Erro interno do servidor" });
    }
  });

  // Rota para listar todos os serviços
  router.get("/servicos", (req: Request, res: Response) => {
    try {
      const servicos = barbeariaService.obterTodosServicos();
      const servicosFormatados = servicos.map((servico, index) => ({
        id: index,
        nome: servico.getNome(),
        preco: servico.getPreco(),
        tempoEstimado: servico.getTempoEstimado(),
      }));

      res.status(200).json(servicosFormatados);
    } catch (error) {
      res.status(500).json({ erro: "Erro interno do servidor" });
    }
  });

  // Rota para listar todos os barbeiros
  router.get("/barbeiros", (req: Request, res: Response) => {
    try {
      const barbeiros = barbeariaService.obterTodosBarbeiros();
      const barbeirosFormatados = barbeiros.map((barbeiro, index) => ({
        id: index,
        nome: barbeiro.getNome(),
        diasTrabalho: barbeiro.getDiasTrabalho(),
        horaInicio: barbeiro.getHoraInicio(),
        horaFim: barbeiro.getHoraFim(),
      }));

      res.status(200).json(barbeirosFormatados);
    } catch (error) {
      res.status(500).json({ erro: "Erro interno do servidor" });
    }
  });

  // Rota para obter horários disponíveis
  router.get("/horarios-disponiveis", (req: Request, res: Response) => {
    try {
      const { barbeiroId, data, servicoId } = req.query;

      if (!barbeiroId || !data || !servicoId) {
        return res
          .status(400)
          .json({ erro: "barbeiroId, data e servicoId são obrigatórios" });
      }

      const barbeiro = barbeariaService.obterBarbeiroPorIndice(
        Number(barbeiroId)
      );
      const servico = barbeariaService.obterServicoPorIndice(Number(servicoId));

      if (!barbeiro || !servico) {
        return res
          .status(404)
          .json({ erro: "Barbeiro ou serviço não encontrado" });
      }

      const dataObj = new Date(data as string);
      const horariosDisponiveis = barbeariaService.obterHorariosDisponiveis(
        barbeiro,
        dataObj,
        servico
      );

      res.status(200).json({ horariosDisponiveis });
    } catch (error) {
      res.status(500).json({ erro: "Erro interno do servidor" });
    }
  });

  // Rota para criar agendamento
  router.post("/agendamentos", (req: Request, res: Response) => {
    try {
      const { telefoneCliente, barbeiroId, servicoId, dataHora } = req.body;

      if (
        !telefoneCliente ||
        barbeiroId === undefined ||
        servicoId === undefined ||
        !dataHora
      ) {
        return res
          .status(400)
          .json({ erro: "Todos os campos são obrigatórios" });
      }

      const cliente = barbeariaService.buscarCliente(telefoneCliente);
      if (!cliente) {
        return res.status(404).json({ erro: "Cliente não encontrado" });
      }

      const barbeiro = barbeariaService.obterBarbeiroPorIndice(
        Number(barbeiroId)
      );
      const servico = barbeariaService.obterServicoPorIndice(Number(servicoId));

      if (!barbeiro || !servico) {
        return res
          .status(404)
          .json({ erro: "Barbeiro ou serviço não encontrado" });
      }

      const dataObj = new Date(dataHora);
      const agendamento = barbeariaService.criarAgendamento(
        cliente,
        barbeiro,
        servico,
        dataObj
      );

      if (!agendamento) {
        return res.status(404).json({ erro: "Erro no agendamento" });
      }

      res.status(201).json({
        mensagem: "Agendamento criado com sucesso!",
        agendamento: {
          cliente: agendamento.getCliente().getNome(),
          barbeiro: agendamento.getBarbeiro().getNome(),
          servico: agendamento.getServico().getNome(),
          preco: agendamento.getServico().getPreco(),
          dataHora: agendamento.getDataHora(),
        },
      });
    } catch (error) {
      res.status(500).json({ erro: "Erro interno do servidor" });
    }
  });

  // Rota para listar agendamentos de um cliente
  router.get("/agendamentos/user/:telefone", (req: Request, res: Response) => {
    try {
      const { telefone } = req.params;
      const agendamentos = barbeariaService.obterAgendamentosCliente(telefone);

      const agendamentosFormatados = agendamentos.map((agendamento) => ({
        cliente: agendamento.getCliente().getNome(),
        barbeiro: agendamento.getBarbeiro().getNome(),
        servico: agendamento.getServico().getNome(),
        preco: agendamento.getServico().getPreco(),
        dataHora: agendamento.getDataHora(),
      }));

      res.status(200).json(agendamentosFormatados);
    } catch (error) {
      res.status(500).json({ erro: "Erro interno do servidor" });
    }
  });

  // Rota para relatório de agendamentos
  router.get("/relatorio/agendamentos", (req: Request, res: Response) => {
    try {
      const agendamentos = barbeariaService.obterTodosAgendamentos();
      const agendamentosFormatados = agendamentos.map((agendamento) => ({
        cliente: agendamento.getCliente().getNome(),
        telefone: agendamento.getCliente().getTelefone(),
        barbeiro: agendamento.getBarbeiro().getNome(),
        servico: agendamento.getServico().getNome(),
        preco: agendamento.getServico().getPreco(),
        dataHora: agendamento.getDataHora(),
      }));

      res.status(200).json(agendamentosFormatados);
    } catch (error) {
      res.status(500).json({ erro: "Erro interno do servidor" });
    }
  });

  // Rota para relatório de faturamento por barbeiro
  router.get("/relatorio/faturamento", (req: Request, res: Response) => {
    try {
      const relatorio = barbeariaService.obterRelatorioFaturamento();
      res.status(200).json(relatorio);
    } catch (error) {
      res.status(500).json({ erro: "Erro interno do servidor" });
    }
  });

  return router;
}
