function calcularMedia() {

    let nome = document.getElementById("nome").value;

    let nota1 = Number(document.getElementById("nota1").value.replace(",", "."));
    let nota2 = Number(document.getElementById("nota2").value.replace(",", "."));
    let nota3 = Number(document.getElementById("nota3").value.replace(",", "."));

    let resultado = document.getElementById("resultado");

    if (nome.trim() === "") {
        resultado.innerHTML = "Digite o nome do aluno!";
        return;
    }

    if (
        document.getElementById("nota1").value.trim() === "" ||
        document.getElementById("nota2").value.trim() === "" ||
        document.getElementById("nota3").value.trim() === ""
    ) {
        resultado.innerHTML = "Preencha todas as notas!";
        return;
    }

    if (
        !Number.isFinite(nota1) ||
        !Number.isFinite(nota2) ||
        !Number.isFinite(nota3) ||
        nota1 < 0 || nota1 > 10 ||
        nota2 < 0 || nota2 > 10 ||
        nota3 < 0 || nota3 > 10
    ) {
        resultado.innerHTML = "As notas devem ser de 0 a 10!";
        return;
    }

    let media = (nota1 + nota2 + nota3) / 3;

    let situacao;

    if (media >= 7) {
        situacao = "Aprovado";
    } else if (media >= 5) {
        situacao = "Recuperação";
    } else {
        situacao = "Reprovado";
    }

    resultado.innerHTML =
        "Aluno: " + nome +
        "<br>Média: " + media.toFixed(2) +
        "<br>Situação: " + situacao;

}
