
function gerarTabuada() {
    const numero = Number(document.getElementById("numero").value);
    const resultado = document.getElementById("resultado");

    resultado.innerHTML = "";

    if (!Number.isInteger(numero) || numero < 1 || numero > 20) {
        resultado.innerHTML = "<p class='erro'>Digite um número inteiro de 1 a 20!</p>";
        return;
    }

    let html = `<h3>Tabuada do ${numero}</h3>`;

    for (let i = 1; i <= 10; i++) {
        html += `<p>${numero} x ${i} = ${numero * i}</p>`;
    }

    resultado.innerHTML = html;
}

function limpar() {
    document.getElementById("numero").value = "";
    document.getElementById("resultado").innerHTML = "";
}
