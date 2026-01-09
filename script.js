// GARANTE QUE NÃO USA DADOS ANTIGOS
localStorage.removeItem("produtos");

let produtos = {};
let carrinho = {};

const area = document.getElementById("produtos");

/* CARREGAR PRODUTOS DO JSON (SEM CACHE) */
fetch("produtos.json?v=" + new Date().getTime())
  .then(res => {
    if (!res.ok) throw new Error("JSON não encontrado");
    return res.json();
  })
  .then(data => {
    produtos = data;
    renderProdutos();
  })
  .catch(err => {
    console.error(err);
    area.innerHTML = "<p>Erro ao carregar produtos</p>";
  });

function renderProdutos(){
  area.innerHTML = "";

  for (let id in produtos){
    const p = produtos[id];

    area.innerHTML += `
      <div class="produto">
        <h3>${p.nome}</h3>

        <select id="u-${id}" onchange="atualizarPreco('${id}')">
          ${Object.keys(p.precos).map(u=>`<option>${u}</option>`).join("")}
        </select>

        <p class="preco" id="p-${id}"></p>

        <div class="controle">
          <button onclick="alterarQtd('${id}',-1)">−</button>
          <span id="q-${id}">0</span>
          <button onclick="alterarQtd('${id}',1)">+</button>
        </div>
      </div>
    `;

    atualizarPreco(id);
  }
}

function atualizarPreco(id){
  const u = document.getElementById("u-"+id).value;
  document.getElementById("p-"+id).innerText =
    "R$ " + produtos[id].precos[u].toFixed(2);
}

function alterarQtd(id, d){
  const u = document.getElementById("u-"+id).value;
  const key = id + "-" + u;

  carrinho[key] ??= { id, u, q: 0 };
  carrinho[key].q = Math.max(0, carrinho[key].q + d);

  document.getElementById("q-"+id).innerText =
    Object.values(carrinho).filter(i => i.id === id).reduce((s,i)=>s+i.q,0);

  document.getElementById("cartCount").innerText =
    Object.values(carrinho).reduce((s,i)=>s+i.q,0);
}



