// Variáveis globais
let clienteLogado = null;
let servicoSelecionado = null;
let barbeiroSelecionado = null;
let horarioSelecionado = null;
let servicos = [];
let barbeiros = [];

// Funções de utilidade
function showMessage(message, type = "success") {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
  messageDiv.className = `message ${type}`;
  messageDiv.classList.add("show");

  setTimeout(() => {
    messageDiv.classList.remove("show");
  }, 3000);
}

function showTab(tabName) {
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  document.getElementById(`tab-${tabName}`).classList.add("active");
  event.target.classList.add("active");

  // Carregar dados específicos da tab
  if (tabName === "meus-agendamentos") {
    carregarMeusAgendamentos();
  }
}

const API_BASE64 = "aHR0cDovLzE4NS4xMzcuMTIyLjEzNzozMDAw";

function getApiBase() {
  return atob(API_BASE64);
}
// Funções de API
async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(`${getApiBase()}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.erro || "Erro na requisição");
    }

    return data;
  } catch (error) {
    showMessage(error.message, "error");
    throw error;
  }
}

// Funções de autenticação
async function cadastrarCliente() {
  const nome = document.getElementById("nome-cadastro").value.trim();
  const telefone = document.getElementById("telefone-cadastro").value.trim();

  if (!nome || !telefone) {
    showMessage("Preencha todos os campos", "error");
    return;
  }

  try {
    const data = await apiRequest("/user", {
      method: "POST",
      body: JSON.stringify({ nome, telefone }),
    });

    showMessage(data.mensagem);
    document.getElementById("nome-cadastro").value = "";
    document.getElementById("telefone-cadastro").value = "";
  } catch (error) {
    // Erro já tratado no apiRequest
  }
}

async function fazerLogin() {
  const telefone = document.getElementById("telefone-login").value.trim();

  if (!telefone) {
    showMessage("Digite seu telefone", "error");
    return;
  }

  try {
    const data = await apiRequest("/login", {
      method: "POST",
      body: JSON.stringify({ telefone }),
    });

    clienteLogado = data.cliente;
    document.getElementById(
      "user-name"
    ).textContent = `Bem-vindo, ${clienteLogado.nome}!`;
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("main-section").classList.remove("hidden");

    // Carregar dados iniciais
    await carregarServicos();
    await carregarBarbeiros();

    showMessage(data.mensagem);
  } catch (error) {
    // Erro já tratado no apiRequest
  }
}

function logout() {
  clienteLogado = null;
  document.getElementById("login-section").classList.remove("hidden");
  document.getElementById("main-section").classList.add("hidden");
  document.getElementById("telefone-login").value = "";
  showMessage("Logout realizado com sucesso");
}

// Funções de carregamento de dados
async function carregarServicos() {
  try {
    servicos = await apiRequest("/servicos");
    const servicosDiv = document.getElementById("servicos-list");

    servicosDiv.innerHTML = servicos
      .map(
        (servico) => `
            <div class="option-item" onclick="selecionarServico(${servico.id})">
                <div>${servico.nome}</div>
                <div class="price">R$ ${servico.preco.toFixed(2)}</div>
                <small>${servico.tempoEstimado}min</small>
            </div>
        `
      )
      .join("");
  } catch (error) {
    // Erro já tratado no apiRequest
  }
}

async function carregarBarbeiros() {
  try {
    barbeiros = await apiRequest("/barbeiros");
    const barbeirosDiv = document.getElementById("barbeiros-list");

    barbeirosDiv.innerHTML = barbeiros
      .map(
        (barbeiro) => `
            <div class="option-item" onclick="selecionarBarbeiro(${
              barbeiro.id
            })">
                <div><strong>${barbeiro.nome}</strong></div>
                <small>${barbeiro.diasTrabalho.join(", ")}</small>
                <small>${barbeiro.horaInicio} - ${barbeiro.horaFim}</small>
            </div>
        `
      )
      .join("");
  } catch (error) {
    // Erro já tratado no apiRequest
  }
}

// Funções de seleção - MELHORADAS
function selecionarServico(servicoId) {
  servicoSelecionado = servicoId;
  document.querySelectorAll("#servicos-list .option-item").forEach((item) => {
    item.classList.remove("selected");
  });
  event.target.closest(".option-item").classList.add("selected");

  // Limpar horários quando trocar serviço
  document.getElementById("horarios-list").innerHTML = "";
  horarioSelecionado = null;
  updateConfirmButton();

  // Auto-buscar horários se barbeiro e data já estão selecionados
  if (
    barbeiroSelecionado &&
    document.getElementById("data-agendamento").value
  ) {
    setTimeout(() => buscarHorarios(), 300);
  }
}

function selecionarBarbeiro(barbeiroId) {
  barbeiroSelecionado = barbeiroId;
  document.querySelectorAll("#barbeiros-list .option-item").forEach((item) => {
    item.classList.remove("selected");
  });
  event.target.closest(".option-item").classList.add("selected");

  // Limpar horários quando trocar barbeiro
  document.getElementById("horarios-list").innerHTML = "";
  horarioSelecionado = null;
  updateConfirmButton();

  // Auto-buscar horários se serviço e data já estão selecionados
  if (servicoSelecionado && document.getElementById("data-agendamento").value) {
    setTimeout(() => buscarHorarios(), 300);
  }
}

function selecionarHorario(horario) {
  horarioSelecionado = horario;
  document.querySelectorAll("#horarios-list .option-item").forEach((item) => {
    item.classList.remove("selected");
  });
  event.target.classList.add("selected");
  updateConfirmButton();
}

function updateConfirmButton() {
  const btnConfirmar = document.getElementById("btn-confirmar");
  btnConfirmar.disabled = !(
    servicoSelecionado !== null &&
    barbeiroSelecionado !== null &&
    horarioSelecionado
  );
}

// Função para buscar e mostrar horários disponíveis
async function buscarHorarios() {
  const data = document.getElementById("data-agendamento").value;

  if (!data || servicoSelecionado === null || barbeiroSelecionado === null) {
    showMessage("Selecione o serviço, barbeiro e data primeiro", "error");
    return;
  }

  try {
    const response = await apiRequest(
      `/horarios-disponiveis?barbeiroId=${barbeiroSelecionado}&data=${data}&servicoId=${servicoSelecionado}`
    );
    const horariosDisponiveis = response.horariosDisponiveis;

    const horariosDiv = document.getElementById("horarios-list");

    if (horariosDisponiveis.length === 0) {
      horariosDiv.innerHTML =
        '<p style="text-align: center; padding: 20px; color: #666;">Nenhum horário disponível para esta data</p>';
    } else {
      horariosDiv.innerHTML = `
                <div style="margin-bottom: 15px; padding: 10px; background: #f0f8ff; border-radius: 8px; text-align: center;">
                    <strong>Horários disponíveis para ${new Date(
                      data
                    ).toLocaleDateString("pt-BR")}:</strong>
                </div>
                ${horariosDisponiveis
                  .map(
                    (horario) => `
                    <div class="option-item horario-item" onclick="selecionarHorario('${horario}')">
                        <div style="font-weight: 600; margin-bottom: 4px;">${horario}</div>
                        <div style="font-size: 12px; opacity: 0.7;">Disponível</div>
                    </div>
                `
                  )
                  .join("")}
            `;
    }
  } catch (error) {
    const horariosDiv = document.getElementById("horarios-list");
    horariosDiv.innerHTML =
      '<p style="text-align: center; padding: 20px; color: #e74c3c;">Erro ao carregar horários</p>';
  }

  horarioSelecionado = null;
  updateConfirmButton();
}

// Função para confirmar agendamento
async function confirmarAgendamento() {
  const data = document.getElementById("data-agendamento").value;
  const dataHora = new Date(`${data}T${horarioSelecionado}:00`);

  try {
    const response = await apiRequest("/agendamentos", {
      method: "POST",
      body: JSON.stringify({
        telefoneCliente: clienteLogado.telefone,
        barbeiroId: barbeiroSelecionado,
        servicoId: servicoSelecionado,
        dataHora: dataHora.toISOString(),
      }),
    });

    showMessage(response.mensagem);

    // Limpar seleções
    document.querySelectorAll(".option-item").forEach((item) => {
      item.classList.remove("selected");
    });
    document.getElementById("data-agendamento").value = "";
    document.getElementById("horarios-list").innerHTML = "";

    servicoSelecionado = null;
    barbeiroSelecionado = null;
    horarioSelecionado = null;
    updateConfirmButton();
  } catch (error) {
    // Erro já tratado no apiRequest
  }
}

// Funções de relatórios
async function carregarMeusAgendamentos() {
  if (!clienteLogado) return;

  try {
    const agendamentos = await apiRequest(
      `/agendamentos/user/${clienteLogado.telefone}`
    );
    const agendamentosDiv = document.getElementById("meus-agendamentos-list");

    if (agendamentos.length === 0) {
      agendamentosDiv.innerHTML = "<p>Você não possui agendamentos.</p>";
    } else {
      agendamentosDiv.innerHTML = agendamentos
        .map(
          (agendamento) => `
                <div class="agendamento-item">
                    <h4>${agendamento.servico}</h4>
                    <p><strong>Barbeiro:</strong> ${agendamento.barbeiro}</p>
                    <p><strong>Data:</strong> ${new Date(
                      agendamento.dataHora
                    ).toLocaleDateString("pt-BR")}</p>
                    <p><strong>Horário:</strong> ${new Date(
                      agendamento.dataHora
                    ).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</p>
                    <p><strong>Preço:</strong> R$ ${agendamento.preco.toFixed(
                      2
                    )}</p>
                </div>
            `
        )
        .join("");
    }
  } catch (error) {
    // Erro já tratado no apiRequest
  }
}

async function carregarTodosAgendamentos() {
  try {
    const agendamentos = await apiRequest("/relatorio/agendamentos");
    const relatorioDiv = document.getElementById("relatorio-content");

    relatorioDiv.innerHTML = `
            <h4>Todos os Agendamentos (${agendamentos.length} total)</h4>
            ${agendamentos
              .map(
                (agendamento) => `
                <div class="agendamento-item">
                    <h4>${agendamento.servico} - ${agendamento.cliente}</h4>
                    <p><strong>Telefone:</strong> ${agendamento.telefone}</p>
                    <p><strong>Barbeiro:</strong> ${agendamento.barbeiro}</p>
                    <p><strong>Data:</strong> ${new Date(
                      agendamento.dataHora
                    ).toLocaleDateString("pt-BR")} às ${new Date(
                  agendamento.dataHora
                ).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}</p>
                    <p><strong>Preço:</strong> R$ ${agendamento.preco.toFixed(
                      2
                    )}</p>
                </div>
            `
              )
              .join("")}
        `;
  } catch (error) {
    // Erro já tratado no apiRequest
  }
}

async function carregarFaturamento() {
  try {
    const faturamento = await apiRequest("/relatorio/faturamento");
    const relatorioDiv = document.getElementById("relatorio-content");

    relatorioDiv.innerHTML = `
            <h4>Faturamento por Barbeiro</h4>
            ${Object.entries(faturamento)
              .map(
                ([barbeiro, dados]) => `
                <div class="faturamento-item">
                    <h4>👨‍💼 ${barbeiro}</h4>
                    <p><strong>Total de Atendimentos:</strong> ${
                      dados.totalAtendimentos
                    }</p>
                    <p><strong>Faturamento Total:</strong> R$ ${dados.faturamentoTotal.toFixed(
                      2
                    )}</p>
                    <p><strong>Média por Atendimento:</strong> R$ ${(
                      dados.faturamentoTotal / dados.totalAtendimentos
                    ).toFixed(2)}</p>
                </div>
            `
              )
              .join("")}
        `;
  } catch (error) {
    // Erro já tratado no apiRequest
  }
}

// Inicialização - MELHORADA
document.addEventListener("DOMContentLoaded", function () {
  const dataInput = document.getElementById("data-agendamento");

  // Auto-buscar horários quando data for alterada
  dataInput.addEventListener("change", function () {
    if (servicoSelecionado && barbeiroSelecionado) {
      setTimeout(() => buscarHorarios(), 300);
    }
  });

  // Adicionar efeitos visuais melhorados
  document.querySelectorAll(".option-item").forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px) scale(1.02)";
    });
    item.addEventListener("mouseleave", function () {
      if (!this.classList.contains("selected")) {
        this.style.transform = "translateY(0) scale(1)";
      }
    });
  });
});
