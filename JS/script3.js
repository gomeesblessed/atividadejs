
function calcularDesconto(subtotal, percentual) {
    return subtotal * (percentual / 100);
}

function calcular() {
    const produto = document.getElementById("produto").value.trim();
    const valor = Number(document.getElementById("valor").value);
    const quantidade = Number(document.getElementById("quantidade").value);
    const desconto = Number(document.getElementById("desconto").value);

    const resultado = document.getElementById("resultado");

    if (
        produto === "" ||
        !Number.isFinite(valor) || valor <= 0 ||
        !Number.isInteger(quantidade) || quantidade <= 0 ||
        !Number.isFinite(desconto) || desconto < 0 || desconto > 100
    ) {
        resultado.innerHTML = "<p class='erro'>Preencha os campos corretamente. Não são permitidos valores negativos.</p>";
        return;
    }

    const subtotal = valor * quantidade;
    const economia = calcularDesconto(subtotal, desconto);
    const total = subtotal - economia;

    resultado.innerHTML = `
        <h3>Resultado da compra</h3>
        <p>Produto: ${produto}</p>
        <p>Subtotal: R$ ${subtotal.toFixed(2)}</p>
        <p>Economia: R$ ${economia.toFixed(2)}</p>
        <h3>Total a pagar: R$ ${total.toFixed(2)}</h3>
    `;
}
