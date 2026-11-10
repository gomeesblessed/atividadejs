
let alunos = JSON.parse(localStorage.getItem("frequencia")) || [];

function salvar() {
    localStorage.setItem("frequencia", JSON.stringify(alunos));
}

function cadastrar() {
    const nome = document.getElementById("nome").value.trim();
    const matricula = document.getElementById("matricula").value.trim();
    const turma = document.getElementById("turma").value.trim();
    const curso = document.getElementById("curso").value.trim();

    if (!nome || !matricula || !turma || !curso) {
        alert("Preencha todos os campos!");
        return;
    }

    if (alunos.some(a => a.matricula === matricula)) {
        alert("Matrícula já cadastrada!");
        return;
    }

    alunos.push({
        nome,
        matricula,
        turma,
        curso,
        historico: []
    });

    salvar();
    atualizar();

    document.getElementById("nome").value = "";
    document.getElementById("matricula").value = "";
    document.getElementById("turma").value = "";
    document.getElementById("curso").value = "";
}

function registrar() {
    const matricula = document.getElementById("aluno").value;
    const data = document.getElementById("data").value;
    const situacao = document.getElementById("situacao").value;

    const aluno = alunos.find(a => a.matricula === matricula);

    if (!aluno || !data) {
        alert("Selecione o aluno e a data!");
        return;
    }

    if (aluno.historico.some(r => r.data === data)) {
        alert("Já existe um registro nessa data!");
        return;
    }

    aluno.historico.push({ data, situacao });

    aluno.historico.sort((a, b) => a.data.localeCompare(b.data));

    salvar();
    atualizar();
}

function contarConsecutivas(historico) {
    let consecutivas = 0;
    let maximo = 0;

    historico.forEach(registro => {
        if (registro.situacao === "injustificada") {
            consecutivas++;
            maximo = Math.max(maximo, consecutivas);
        } else {
            consecutivas = 0;
        }
    });

    return maximo;
}

function atualizar() {
    const select = document.getElementById("aluno");

    select.innerHTML = alunos.map(a =>
        `<option value="${a.matricula}">${a.nome}</option>`
    ).join("");

    document.getElementById("relatorio").innerHTML =
        alunos.map(a => {
            const faltas = a.historico.filter(r =>
                r.situacao !== "presenca"
            ).length;

            const alertar = contarConsecutivas(a.historico) > 3;

            return `
                <div class="aluno">
                    <strong>${a.nome}</strong><br>
                    Matrícula: ${a.matricula}<br>
                    Turma: ${a.turma}<br>
                    Curso: ${a.curso}<br>
                    Faltas: ${faltas}<br>
                    ${alertar ? '<p class="alerta">⚠ Mais de 3 faltas consecutivas sem justificativa!</p>' : ''}
                    <strong>Histórico:</strong>
                    ${a.historico.map(r =>
                        `<p>${r.data} - ${r.situacao}</p>`
                    ).join("")}
                </div>
            `;
        }).join("");
}

atualizar();
