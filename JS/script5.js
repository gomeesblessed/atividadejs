
const alunos = [
    { nome: "Ana Silva", curso: "Informática", matricula: "001" },
    { nome: "João Pedro", curso: "Administração", matricula: "002" },
    { nome: "Maria Souza", curso: "Informática", matricula: "003" },
    { nome: "Carlos Lima", curso: "Enfermagem", matricula: "004" },
    { nome: "Pedro Santos", curso: "Administração", matricula: "005" }
];

function pesquisar() {
    const nome = document.getElementById("pesquisa").value
        .toLowerCase().trim();

    const curso = document.getElementById("filtroCurso").value
        .toLowerCase().trim();

    const resultado = document.getElementById("resultado");

    const encontrados = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(nome) &&
        aluno.curso.toLowerCase().includes(curso)
    );

    const primeiro = encontrados.find(aluno =>
        aluno.nome.toLowerCase().includes(nome)
    );

    resultado.innerHTML = `<h3>${encontrados.length} aluno(s) encontrado(s)</h3>`;

    if (encontrados.length === 0) {
        resultado.innerHTML += "<p>Nenhum aluno encontrado!</p>";
        return;
    }

    encontrados.forEach(aluno => {
        resultado.innerHTML += `
            <div class="aluno">
                <strong>${aluno.nome}</strong><br>
                Curso: ${aluno.curso}<br>
                Matrícula: ${aluno.matricula}
            </div>
        `;
    });

    console.log("Primeiro resultado:", primeiro);
}

pesquisar();
