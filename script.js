const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmhL8hBgWNEZQ9_-rnyr5GSph5ixlpmC4kZAln-wFxIXjCSFySGTbUa0BfpSV3DoScj57e2oCR-wDK/pub?output=csv";

let produtos = {};
let carrinho = {};

fetch(URL_CSV)
  .then(r => r.text())
  .then(csv => {
    const linhas = csv.trim().split("\n");
    const headers = linhas.shift().split(",");

    linhas.forEach(l => {
      const cols = l.split(",");
      const row = {};
      headers.forEach((h,i)=> row[h.trim()] = cols[i]?.trim());

      produtos[row.id] = {
        nome: row.nome,
        precos: {
          Kg: row.kg ? +row.kg : null,
          Un: row.un ? +row.un : null,
          Dz: row.dz ? +row.dz : null,
          Cx: row.cx ? +row.cx : null
        }
      };
    });

    renderProdutos();
  });

function renderProdutos(){
  const area = document.getElementById("produtos");
  area.innerHTML = "";

  for(const id in produtos){
    const p = produtos[id];
    const unidades = Object.entries(p.precos).filter(u => u[1]);

    area.innerHTML += `
      <div class="produto">
        <h3>${p.nome}</h3>

        <select id="u-${id}" onchange="atualizarPreco('${id}')">
          ${unidades.map(u=>`<option value="${u[0]}">${u[0]}</option>`).join("")}
        </select>

        <p class="preco" id="preco-${id}"></p>

        <input type="number" min="1" value="1" id="q-${id}">

        <button onclick="addCarrinho('${id}')">Adicionar</button>
      </div>
    `;

    atualizarPreco(id);
  }
}

function atualizarPreco(id){
  const select = document.getElementById("u-"+id);
  if (!select) return;

  const u = select.value;
  const preco = produtos[id].precos[u];

  document.getElementById("preco-"+id).innerHTML = `
    <strong>R$ ${preco.toFixed(2)}</strong>
    <span style="opacity:.7"> / ${u}</span>
  `;
}


function addCarrinho(id){
  const u = document.getElementById("u-"+id).value;
  const q = +document.getElementById("q-"+id).value;

  const key = id + "-" + u;
  if(!carrinho[key]) carrinho[key] = {id,u,q:0};

  carrinho[key].q += q;

  document.getElementById("cartCount").innerText =
    Object.values(carrinho).reduce((s,i)=>s+i.q,0);
}

function abrirCarrinho(){
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  let total = 0;

  for(const k in carrinho){
    const c = carrinho[k];
    const p = produtos[c.id];
    const valor = p.precos[c.u] * c.q;
    total += valor;

    lista.innerHTML += `
      <p>${p.nome} – ${c.q} ${c.u} = R$ ${valor.toFixed(2)}</p>
    `;
  }

  document.getElementById("total").innerText =
    "TOTAL: R$ " + total.toFixed(2);

  document.getElementById("modal").style.display="flex";
}

function fecharCarrinho(){
  document.getElementById("modal").style.display="none";
}

