
let alunos = JSON.parse(localStorage.getItem("escola")) || [];

function salvarDados() {
    localStorage.setItem("escola", JSON.stringify(alunos));
}

function mostrar(secao) {
    document.querySelectorAll("main section").forEach(s => {
        s.hidden = true;
    });

    document.getElementById(secao).hidden = false;

    if (secao === "inicio") painel();
    if (secao === "cadastro") listar();
    if (secao === "relatorios") relatorio();
}

function limparFormulario() {
    ["id", "nome", "matricula", "turma", "curso",
     "nota1", "nota2", "faltas", "aulas"].forEach(id => {
        document.getElementById(id).value = "";
    });
}

function salvarAluno() {
    const id = document.getElementById("id").value;
    const nome = document.getElementById("nome").value.trim();
    const matricula = document.getElementById("matricula").value.trim();
    const turma = document.getElementById("turma").value.trim();
    const curso = document.getElementById("curso").value.trim();

    const nota1 = Number(document.getElementById("nota1").value);
    const nota2 = Number(document.getElementById("nota2").value);
    const faltas = Number(document.getElementById("faltas").value);
    const aulas = Number(document.getElementById("aulas").value);

    if (!nome || !matricula || !turma || !curso ||
        ![nota1, nota2].every(n => Number.isFinite(n) && n >= 0 && n <= 10) ||
        !Number.isInteger(faltas) || faltas < 0 ||
        !Number.isInteger(aulas) || aulas <= 0 || faltas > aulas) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    const duplicada = alunos.some(a =>
        a.matricula === matricula && a.id !== id
    );

    if (duplicada) {
        alert("Matrícula já cadastrada!");
        return;
    }

    const aluno = {
        id: id || String(Date.now()),
        nome,
        matricula,
        turma,
        curso,
        nota1,
        nota2,
        faltas,
        aulas
    };

    if (id) {
        alunos = alunos.map(a => a.id === id ? aluno : a);
    } else {
        alunos.push(aluno);
    }

    salvarDados();
    limparFormulario();
    listar();
    painel();

    alert("Estudante salvo com sucesso!");
}

function editar(id) {
    const a = alunos.find(aluno => aluno.id === id);

    if (!a) return;

    Object.keys(a).forEach(chave => {
        const campo = document.getElementById(chave);
        if (campo) campo.value = a[chave];
    });
}

function excluir(id) {
    if (!confirm("Deseja excluir este estudante?")) return;

    alunos = alunos.filter(a => a.id !== id);

    salvarDados();
    listar();
    painel();
}

function media(a) {
    return (a.nota1 + a.nota2) / 2;
}

function listar() {
    const pesquisa = document.getElementById("pesquisa")
        .value.toLowerCase().trim();

    const filtro = document.getElementById("filtroTurma").value;

    const turmas = [...new Set(alunos.map(a => a.turma))];

    document.getElementById("filtroTurma").innerHTML =
        '<option value="">Todas as turmas</option>' +
        turmas.map(t => `<option value="${escapeHTML(t)}">${escapeHTML(t)}</option>`).join("");

    document.getElementById("filtroTurma").value = filtro;

    const filtrados = alunos.filter(a =>
        (a.nome.toLowerCase().includes(pesquisa) ||
         a.matricula.toLowerCase().includes(pesquisa)) &&
        (!filtro || a.turma === filtro)
    );

    document.getElementById("lista").innerHTML =
        filtrados.map(a => `
            <div class="aluno">
                <h3>${escapeHTML(a.nome)}</h3>
                Matrícula: ${escapeHTML(a.matricula)}<br>
                Turma: ${escapeHTML(a.turma)}<br>
                Curso: ${escapeHTML(a.curso)}<br>
                Média: ${media(a).toFixed(2)}<br>
                Frequência: ${(100 * (a.aulas - a.faltas) / a.aulas).toFixed(1)}%<br>
                ${media(a) < 7 ? '<p class="alerta">Atenção: necessita de acompanhamento acadêmico.</p>' : ''}
                ${a.faltas > 3 ? '<p class="alerta">Atenção: possui mais de três faltas.</p>' : ''}
                <button onclick="editar('${a.id}')">Editar</button>
                <button onclick="excluir('${a.id}')">Excluir</button>
            </div>
        `).join("") || "<p>Nenhum estudante encontrado.</p>";
}

function painel() {
    const total = alunos.length;

    const aprovados = alunos.filter(a => media(a) >= 7).length;
    const recuperacao = alunos.filter(a => media(a) >= 5 && media(a) < 7).length;
    const reprovados = alunos.filter(a => media(a) < 5).length;

    const mediaGeral = total
        ? alunos.reduce((s, a) => s + media(a), 0) / total
        : 0;

    document.getElementById("indicadores").innerHTML = `
        <div class="indicador">
            <h3>Total de estudantes: ${total}</h3>
            <p>Média geral: ${mediaGeral.toFixed(2)}</p>
            <p>Aprovados: ${aprovados}</p>
            <p>Em recuperação: ${recuperacao}</p>
            <p>Reprovados: ${reprovados}</p>
        </div>
    `;
}

function relatorio() {
    document.getElementById("relatorio").innerHTML =
        `<h3>Relatório Geral de Estudantes</h3>
        <p>Total de estudantes: ${alunos.length}</p>` +
        alunos.map(a => `
            <div class="aluno">
                <strong>${escapeHTML(a.nome)}</strong><br>
                Matrícula: ${escapeHTML(a.matricula)}<br>
                Turma: ${escapeHTML(a.turma)}<br>
                Curso: ${escapeHTML(a.curso)}<br>
                Média: ${media(a).toFixed(2)}<br>
                Faltas: ${a.faltas}<br>
                Frequência: ${(100 * (a.aulas - a.faltas) / a.aulas).toFixed(1)}%
            </div>
        `).join("");
}

function escapeHTML(valor) {
    return String(valor).replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[c]);
}

painel();
