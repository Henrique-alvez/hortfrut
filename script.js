const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmhL8hBgWNEZQ9_-rnyr5GSph5ixlpmC4kZAln-wFxIXjCSFySGTbUa0BfpSV3DoScj57e2oCR-wDK/pub?output=csv";

let carrinho = [];

/* ===== CSV PARSER ROBUSTO ===== */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if ((char === ";" || char === ",") && !insideQuotes) {
      row.push(cell);
      cell = "";
    } else if (char === "\n" && !insideQuotes) {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

/* ===== CARREGAR PRODUTOS ===== */
fetch(CSV_URL)
  .then(r => r.text())
  .then(csv => {
    const linhas = parseCSV(csv);
    linhas.shift(); // remove cabeçalho

    const area = document.getElementById("produtos");
    area.innerHTML = "";

    linhas.forEach(col => {
      if (col.length < 5) return;

      const limpar = v => v.replace(/\uFEFF/g, "").trim();

      const id      = limpar(col[0]);
      const nome    = limpar(col[1]);
      const preco   = Number(limpar(col[2]).replace(",", "."));
      const unidade = limpar(col[3]);
      const ativo   = (limpar(col[4]) || "sim").toLowerCase();

      if (!nome || isNaN(preco)) return;
      if (ativo !== "sim") return;

      area.innerHTML += `
        <div class="produto">
          <h3>${nome}</h3>
          <p>R$ ${preco.toFixed(2)} / ${unidade}</p>

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

/* ===== CARRINHO ===== */
function addCarrinho(nome, preco, unidade, inputId) {
  const qtd = Number(document.getElementById(inputId).value);
  if (!qtd || qtd <= 0) return alert("Quantidade inválida");

  carrinho.push({ nome, preco, unidade, qtd });
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
  document.getElementById("cartCount").innerText =
    carrinho.reduce((s, i) => s + i.qtd, 0);
  abrirCarrinho();
}

function finalizar() {
  const nome = document.getElementById("nome").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  if (!nome || !endereco) return alert("Preencha nome e endereço");

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
