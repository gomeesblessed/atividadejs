
let alunos = JSON.parse(localStorage.getItem("dashboard")) || [];

function salvar() {
    localStorage.setItem("dashboard", JSON.stringify(alunos));
}

function cadastrar() {
    const nome = document.getElementById("nome").value.trim();
    const turma = document.getElementById("turma").value.trim();
    const nota1 = Number(document.getElementById("nota1").value);
    const nota2 = Number(document.getElementById("nota2").value);
    const presencas = Number(document.getElementById("presencas").value);
    const aulas = Number(document.getElementById("aulas").value);

    if (!nome || !turma ||
        ![nota1, nota2].every(n => Number.isFinite(n) && n >= 0 && n <= 10) ||
        !Number.isInteger(presencas) ||
        !Number.isInteger(aulas) ||
        aulas <= 0 || presencas < 0 || presencas > aulas) {
        alert("Verifique os dados informados!");
        return;
    }

    alunos.push({ nome, turma, nota1, nota2, presencas, aulas });

    salvar();
    atualizar();

    ["nome", "turma", "nota1", "nota2", "presencas", "aulas"]
        .forEach(id => document.getElementById(id).value = "");
}

function atualizar() {
    const filtro = document.getElementById("filtro").value;

    const turmas = [...new Set(alunos.map(a => a.turma))];

    document.getElementById("filtro").innerHTML =
        '<option value="">Todas as turmas</option>' +
        turmas.map(t => `<option value="${t}">${t}</option>`).join("");

    document.getElementById("filtro").value = filtro;

    const filtrados = alunos.filter(a =>
        !filtro || a.turma === filtro
    );

    const media = filtrados.length
        ? filtrados.reduce((s, a) => s + (a.nota1 + a.nota2) / 2, 0) / filtrados.length
        : 0;

    const aprovados = filtrados.filter(a =>
        (a.nota1 + a.nota2) / 2 >= 7
    ).length;

    const recuperacao = filtrados.filter(a => {
        const m = (a.nota1 + a.nota2) / 2;
        return m >= 5 && m < 7;
    }).length;

    const reprovados = filtrados.filter(a =>
        (a.nota1 + a.nota2) / 2 < 5
    ).length;

    const percentual = n =>
        filtrados.length ? (n / filtrados.length * 100).toFixed(1) : 0;

    const frequencia = filtrados.length
        ? filtrados.reduce((s, a) => s + a.presencas / a.aulas * 100, 0) / filtrados.length
        : 0;

    document.getElementById("indicadores").innerHTML = `
        <div class="indicador">
            <h3>Total: ${filtrados.length}</h3>
            <p>Média geral: ${media.toFixed(2)}</p>
            <p>Aprovados: ${percentual(aprovados)}%</p>
            <p>Recuperação: ${percentual(recuperacao)}%</p>
            <p>Reprovados: ${percentual(reprovados)}%</p>
            <p>Frequência média: ${frequencia.toFixed(1)}%</p>
        </div>
    `;

    document.getElementById("lista").innerHTML =
        filtrados.map(a => {
            const m = (a.nota1 + a.nota2) / 2;

            return `
                <div class="aluno">
                    <strong>${a.nome}</strong><br>
                    Turma: ${a.turma}<br>
                    Média: ${m.toFixed(2)}<br>
                    Frequência: ${(a.presencas / a.aulas * 100).toFixed(1)}%
                </div>
            `;
        }).join("");

    desenharGrafico(filtrados);
}

function desenharGrafico(dados) {
    const canvas = document.getElementById("grafico");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const grupos = {};

    dados.forEach(a => {
        if (!grupos[a.turma]) grupos[a.turma] = [];
        grupos[a.turma].push((a.nota1 + a.nota2) / 2);
    });

    const turmas = Object.keys(grupos);

    if (!turmas.length) {
        ctx.fillText("Nenhum dado disponível", 150, 120);
        return;
    }

    const largura = canvas.width / turmas.length;

    turmas.forEach((turma, i) => {
        const media = grupos[turma].reduce((s, n) => s + n, 0) /
            grupos[turma].length;

        const altura = media * 18;
        const x = i * largura + 15;

        ctx.fillStyle = "#3949ab";
        ctx.fillRect(x, 200 - altura, largura - 30, altura);

        ctx.fillStyle = "#222";
        ctx.fillText(media.toFixed(1), x, 190 - altura);
        ctx.fillText(turma, x, 220);
    });
}

atualizar();
