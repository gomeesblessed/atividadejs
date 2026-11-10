
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

function salvar() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function adicionar() {
    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const prioridade = document.getElementById("prioridade").value;
    const prazo = document.getElementById("prazo").value;

    if (!titulo || !prazo) {
        alert("Informe o título e o prazo!");
        return;
    }

    tarefas.push({
        id: Date.now(),
        titulo,
        descricao,
        prioridade,
        prazo,
        concluida: false
    });

    salvar();
    listar();

    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("prazo").value = "";
}

function concluir(id) {
    const tarefa = tarefas.find(t => t.id === id);
    tarefa.concluida = !tarefa.concluida;

    salvar();
    listar();
}

function excluir(id) {
    tarefas = tarefas.filter(t => t.id !== id);

    salvar();
    listar();
}

function editar(id) {
    const tarefa = tarefas.find(t => t.id === id);

    const novoTitulo = prompt("Novo título:", tarefa.titulo);

    if (novoTitulo === null) return;

    if (!novoTitulo.trim()) {
        alert("O título não pode ficar vazio!");
        return;
    }

    tarefa.titulo = novoTitulo.trim();

    salvar();
    listar();
}

function listar() {
    const filtro = document.getElementById("filtro").value;
    const ordem = document.getElementById("ordem").value;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    let filtradas = tarefas.filter(t => {
        const atrasada = !t.concluida &&
            new Date(t.prazo + "T00:00:00") < hoje;

        if (filtro === "pendente") return !t.concluida;
        if (filtro === "concluida") return t.concluida;
        if (filtro === "atrasada") return atrasada;

        return true;
    });

    if (ordem === "prazo") {
        filtradas.sort((a, b) => a.prazo.localeCompare(b.prazo));
    } else {
        const pesos = { Alta: 1, Média: 2, Baixa: 3 };

        filtradas.sort((a, b) =>
            pesos[a.prioridade] - pesos[b.prioridade]
        );
    }

    const concluidas = tarefas.filter(t => t.concluida).length;
    const pendentes = tarefas.length - concluidas;

    document.getElementById("indicadores").textContent =
        `Total: ${tarefas.length} | Concluídas: ${concluidas} | Pendentes: ${pendentes}`;

    document.getElementById("lista").innerHTML =
        filtradas.map(t => {
            const atrasada = !t.concluida &&
                new Date(t.prazo + "T00:00:00") < hoje;

            return `
                <div class="tarefa ${atrasada ? "atrasada" : ""} ${t.concluida ? "concluida" : ""}">
                    <h3>${escapeHTML(t.titulo)}</h3>
                    <p>${escapeHTML(t.descricao)}</p>
                    <p>Prioridade: ${t.prioridade}</p>
                    <p>Prazo: ${t.prazo}</p>
                    <p>${atrasada ? "⚠ Atrasada" : t.concluida ? "Concluída" : "Pendente"}</p>
                    <button onclick="concluir(${t.id})">Concluir/Desfazer</button>
                    <button onclick="editar(${t.id})">Editar</button>
                    <button onclick="excluir(${t.id})">Excluir</button>
                </div>
            `;
        }).join("");
}

function escapeHTML(valor) {
    return valor.replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;",
        '"': "&quot;", "'": "&#039;"
    })[c]);
}

listar();
