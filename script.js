const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmhL8hBgWNEZQ9_-rnyr5GSph5ixlpmC4kZAln-wFxIXjCSFySGTbUa0BfpSV3DoScj57e2oCR-wDK/pub?output=csv";

let produtos = {};
let carrinho = {};

document.addEventListener("DOMContentLoaded", () => {
  fetch(CSV_URL)
    .then(r => r.text())
    .then(csv => {
      console.log("CSV bruto:", csv);

      if (!csv || csv.length < 10) {
        throw "CSV vazio";
      }

      const linhas = csv.split(/\r?\n/).filter(l => l.trim());
      const sep = linhas[0].includes(";") ? ";" : ",";
      const headers = linhas.shift().split(sep).map(h => h.trim().toLowerCase());

      linhas.forEach(l => {
        const cols = l.split(sep).map(c => c.trim());
        if (cols.length < 2) return;

        const row = {};
        headers.forEach((h, i) => row[h] = cols[i] || "");

        if (!row.id || !row.nome) return;

        produtos[row.id] = {
          nome: row.nome,
          precos: {
            Kg: row.kg ? Number(row.kg) : null,
            Un: row.un ? Number(row.un) : null,
            Dz: row.dz ? Number(row.dz) : null,
            Cx: row.cx ? Number(row.cx) : null
          }
        };
      });

      console.log("Produtos processados:", produtos);
      renderProdutos();
    })
    .catch(e => {
      console.error("ERRO AO CARREGAR PRODUTOS:", e);
    });
});

function renderProdutos() {
  const area = document.getElementById("produtos");
  area.innerHTML = "";

  const ids = Object.keys(produtos);
  if (!ids.length) {
    area.innerHTML = "<p style='color:red'>Nenhum produto carregado</p>";
    return;
  }

  ids.forEach(id => {
    const p = produtos[id];
    const unidades = Object.entries(p.precos).filter(u => u[1]);

    if (!unidades.length) return;

    area.innerHTML += `
      <div class="produto-card">
        <h3>${p.nome}</h3>

        <select id="u-${id}" onchange="atualizarPreco('${id}')">
          ${unidades.map(u => `<option value="${u[0]}">${u[0]}</option>`).join("")}
        </select>

        <p class="preco" id="preco-${id}"></p>

        <input type="number" id="q-${id}" min="1" value="1">

        <button onclick="addCarrinho('${id}')">Adicionar ao carrinho</button>
      </div>
    `;

    atualizarPreco(id);
  });
}

function atualizarPreco(id) {
  const u = document.getElementById("u-" + id).value;
  const preco = produtos[id].precos[u];

  document.getElementById("preco-" + id).innerHTML =
    `R$ ${preco.toFixed(2)} / ${u}`;
}

function addCarrinho(id) {
  const u = document.getElementById("u-" + id).value;
  const q = Number(document.getElementById("q-" + id).value);

  const key = id + "-" + u;
  if (!carrinho[key]) carrinho[key] = { id, u, q: 0 };

  carrinho[key].q += q;

  document.getElementById("cartCount").innerText =
    Object.values(carrinho).reduce((s, i) => s + i.q, 0);
}

function abrirCarrinho() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  let total = 0;

  Object.values(carrinho).forEach(c => {
    const p = produtos[c.id];
    const valor = p.precos[c.u] * c.q;
    total += valor;

    lista.innerHTML += `
      <p>${p.nome} – ${c.q} ${c.u} → R$ ${valor.toFixed(2)}</p>
    `;
  });

  document.getElementById("total").innerText =
    "TOTAL: R$ " + total.toFixed(2);

  document.getElementById("modal").style.display = "flex";
}

function fecharCarrinho() {
  document.getElementById("modal").style.display = "none";
}
