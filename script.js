const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmhL8hBgWNEZQ9_-rnyr5GSph5ixlpmC4kZAln-wFxIXjCSFySGTbUa0BfpSV3DoScj57e2oCR-wDK/pub?output=csv";

let produtos = {};
let carrinho = {};

fetch(URL_CSV)
  .then(res => res.text())
  .then(texto => {
    const linhas = texto.trim().split("\n");
    const cabecalho = linhas.shift().split(",");

    linhas.forEach(linha => {
      const dados = linha.split(",");

      const obj = {};
      cabecalho.forEach((c, i) => obj[c.trim()] = dados[i]?.trim());

      produtos[obj.id] = {
        nome: obj.nome,
        precos: {
          Kg: obj.kg ? Number(obj.kg) : null,
          Un: obj.un ? Number(obj.un) : null,
          Dz: obj.dz ? Number(obj.dz) : null,
          Cx: obj.cx ? Number(obj.cx) : null,
        }
      };
    });

    renderProdutos();
  })
  .catch(err => {
    console.error("ERRO AO CARREGAR PRODUTOS", err);
  });

function renderProdutos() {
  const area = document.getElementById("produtos");
  area.innerHTML = "";

  for (let id in produtos) {
    const p = produtos[id];
    const unidades = Object.entries(p.precos).filter(e => e[1]);

    area.innerHTML += `
      <div class="produto">
        <h3>${p.nome}</h3>

        <select id="u-${id}">
          ${unidades.map(([u]) => `<option>${u}</option>`).join("")}
        </select>

        <input type="number" min="1" value="1" id="q-${id}">

        <button onclick="addCarrinho('${id}')">Adicionar</button>
      </div>
    `;
  }
}

function addCarrinho(id) {
  const u = document.getElementById("u-" + id).value;
  const q = Number(document.getElementById("q-" + id).value);

  const chave = id + "-" + u;

  if (!carrinho[chave]) {
    carrinho[chave] = { id, u, q: 0 };
  }

  carrinho[chave].q += q;

  document.getElementById("cartCount").innerText =
    Object.values(carrinho).reduce((s, i) => s + i.q, 0);
}

function abrirCarrinho() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  let total = 0;

  for (let k in carrinho) {
    const c = carrinho[k];
    const p = produtos[c.id];
    const valor = p.precos[c.u] * c.q;
    total += valor;

    lista.innerHTML += `<p>${p.nome} - ${c.q} ${c.u} (R$ ${valor.toFixed(2)})</p>`;
  }

  document.getElementById("total").innerText =
    "Total R$ " + total.toFixed(2);

  document.getElementById("modal").style.display = "flex";
}

function fecharCarrinho() {
  document.getElementById("modal").style.display = "none";
}
