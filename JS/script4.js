
let alunos = [];

function cadastrar() {
    const nome = document.getElementById("nome").value.trim();
    const idade = Number(document.getElementById("idade").value);
    const curso = document.getElementById("curso").value.trim();
    const matricula = document.getElementById("matricula").value.trim();

    if (!nome || !curso || !matricula ||
        !Number.isInteger(idade) || idade <= 0) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    const repetida = alunos.find(a => a.matricula === matricula);

    if (repetida) {
        alert("Esta matrícula já está cadastrada!");
        return;
    }

    alunos.push({ nome, idade, curso, matricula });

    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("curso").value = "";
    document.getElementById("matricula").value = "";

    listar();
}

function listar() {
    const lista = document.getElementById("lista");

    lista.innerHTML = alunos.map(aluno => `
        <div class="aluno">
            <strong>${escapeHTML(aluno.nome)}</strong><br>
            Idade: ${aluno.idade}<br>
            Curso: ${escapeHTML(aluno.curso)}<br>
            Matrícula: ${escapeHTML(aluno.matricula)}
        </div>
    `).join("");

    document.getElementById("total").textContent =
        `Total: ${alunos.length} alunos`;
}

function escapeHTML(valor) {
    return valor.replace(/[&<>"']/g, letra => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[letra]);
}
