alert("SCRIPT CARREGOU");
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmhL8hBgWNEZQ9_-rnyr5GSph5ixlpmC4kZAln-wFxIXjCSFySGTbUa0BfpSV3DoScj57e2oCR-wDK/pub?output=csv";

let carrinho = [];

fetch(CSV_URL)
  .then(r => r.text())
  .then(csv => {
    const linhas = csv.trim().split("\n");
    const header = linhas.shift(); // remove cabeçalho

    const area = document.getElementById("produtos");
    area.innerHTML = "";

    linhas.forEach(linha => {
      // SUPORTE A ; OU ,
      const col = linha.includes(";")
        ? linha.split(";")
        : linha.split(",");

      if (col.length < 5) return;

      let [id, nome, preco, unidade, ativo] = col.map(v => v.trim());

      // remove \r escondido
      ativo = ativo.replace("\r", "").toLowerCase();

      if (ativo !== "sim") return;

      area.innerHTML += `
        <div class="produto">
          <h3>${nome}</h3>
          <p>R$ ${Number(preco).toFixed(2)} / ${unidade}</p>

          <input
            type="number"
            min="1"
            value="1"
            id="q-${id}"
          >

          <button onclick="addCarrinho(
            '${nome}',
            ${preco},
            '${unidade}',
            'q-${id}'
          )">
            Adicionar ao carrinho
          </button>
        </div>
      `;
    });
  })
  .catch(err => {
    console.error(err);
    document.getElementById("produtos").innerHTML =
      "<p>Erro ao carregar produtos</p>";
  });

// ===== CARRINHO =====
function addCarrinho(nome, preco, unidade, inputId) {
  const qtd = Number(document.getElementById(inputId).value);

  if (!qtd || qtd <= 0) {
    alert("Quantidade inválida");
    return;
  }

  carrinho.push({ nome, preco, unidade, qtd });
  atualizarContador();
}

function atualizarContador() {
  document.getElementById("cartCount").innerText =
    carrinho.reduce((s, i) => s + i.qtd, 0);
}

function abrirCarrinho() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  let total = 0;

  carrinho.forEach((p, i) => {
    const v = p.preco * p.qtd;
    total += v;

    lista.innerHTML += `
      <p>
        ${p.nome} — ${p.qtd} ${p.unidade}
        <strong>R$ ${v.toFixed(2)}</strong>
        <button onclick="remover(${i})">✕</button>
      </p>
    `;
  });

  document.getElementById("total").innerText =
    "Total: R$ " + total.toFixed(2);

  document.getElementById("modal").style.display = "flex";
}

function fecharCarrinho() {
  document.getElementById("modal").style.display = "none";
}

function remover(i) {
  carrinho.splice(i, 1);
  atualizarContador();
  abrirCarrinho();
}

function finalizar() {
  const nome = document.getElementById("nome").value;
  const endereco = document.getElementById("endereco").value;

  if (!nome || !endereco) {
    alert("Preencha nome e endereço");
    return;
  }

  let texto = `🛒 Pedido\nCliente: ${nome}\nEndereço: ${endereco}\n\n`;
  let total = 0;

  carrinho.forEach(p => {
    const v = p.preco * p.qtd;
    total += v;
    texto += `- ${p.nome} (${p.qtd} ${p.unidade}) R$ ${v.toFixed(2)}\n`;
  });

  texto += `\nTotal: R$ ${total.toFixed(2)}`;

  window.open(
    `https://wa.me/5511999999999?text=${encodeURIComponent(texto)}`,
    "_blank"
  );
}
fetch(CSV_URL)
  .then(r => r.text())
  .then(csv => {
    console.log("CSV BRUTO:");
    console.log(csv);
  })
  .catch(err => console.error(err));


