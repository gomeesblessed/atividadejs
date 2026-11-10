
let produtos = [];

function cadastrar() {
    const nome = document.getElementById("produto").value.trim();
    const codigo = document.getElementById("codigo").value.trim();
    const quantidade = Number(document.getElementById("quantidade").value);
    const preco = Number(document.getElementById("preco").value);

    if (!nome || !codigo ||
        !Number.isInteger(quantidade) || quantidade < 0 ||
        !Number.isFinite(preco) || preco <= 0) {
        alert("Preencha os campos corretamente!");
        return;
    }

    if (produtos.find(p => p.codigo === codigo)) {
        alert("Código já cadastrado!");
        return;
    }

    produtos.push({ nome, codigo, quantidade, preco });

    document.getElementById("produto").value = "";
    document.getElementById("codigo").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("preco").value = "";

    listar();
}

function entrada() {
    movimentar(1);
}

function saida() {
    movimentar(-1);
}

function movimentar(tipo) {
    const codigo = document.getElementById("codigoMovimento").value.trim();
    const quantidade = Number(
        document.getElementById("quantidadeMovimento").value
    );

    const produto = produtos.find(p => p.codigo === codigo);

    if (!produto || !Number.isInteger(quantidade) || quantidade <= 0) {
        alert("Produto ou quantidade inválidos!");
        return;
    }

    if (tipo === -1 && quantidade > produto.quantidade) {
        alert("Estoque insuficiente!");
        return;
    }

    produto.quantidade += quantidade * tipo;

    document.getElementById("codigoMovimento").value = "";
    document.getElementById("quantidadeMovimento").value = "";

    listar();
}

function listar() {
    const lista = document.getElementById("lista");

    lista.innerHTML = produtos.map(p => `
        <div class="produto ${p.quantidade < 5 ? "baixo" : ""}">
            <strong>${p.nome}</strong><br>
            Código: ${p.codigo}<br>
            Quantidade: ${p.quantidade}<br>
            Preço: R$ ${p.preco.toFixed(2)}<br>
            ${p.quantidade < 5 ? "⚠ Estoque baixo!" : "Estoque normal"}
        </div>
    `).join("");

    const total = produtos.reduce(
        (soma, p) => soma + p.quantidade * p.preco, 0
    );

    document.getElementById("valorTotal").textContent =
        `Valor total: R$ ${total.toFixed(2)}`;
}
