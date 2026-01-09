let produtos = {};
let carrinho = {};

const area = document.getElementById("produtos");

/* CARREGAR PRODUTOS DO JSON */
fetch("produtos.json")
  .then(res => res.json())
  .then(data => {
    produtos = data;
    renderProdutos();
  })
  .catch(() => {
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

/* PREÇO */
function atualizarPreco(id){
  const u = document.getElementById("u-"+id).value;
  document.getElementById("p-"+id).innerText =
    "R$ " + produtos[id].precos[u].toFixed(2);
}

/* CARRINHO */
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

/* ABRIR CARRINHO */
function abrirCarrinho(){
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  let total = 0;

  for (let k in carrinho){
    const c = carrinho[k];
    if(c.q){
      const valor = produtos[c.id].precos[c.u] * c.q;
      total += valor;

      lista.innerHTML += `
        <p>
          ${produtos[c.id].nome} ${c.q} ${c.u}
          <strong>R$ ${valor.toFixed(2)}</strong>
        </p>
      `;
    }
  }

  document.getElementById("total").innerText =
    "Subtotal R$ " + total.toFixed(2);

  document.getElementById("modal").style.display = "flex";
}

function fecharCarrinho(){
  document.getElementById("modal").style.display = "none";
}

/* FINALIZAR WHATS */
function finalizar(){
  const nome = document.getElementById("nome").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const frete = Number(document.getElementById("frete").value);

  if (!nome || !endereco){
    alert("Preencha nome e endereço");
    return;
  }

  let texto = `Pedido - Hortifruti Verde Vida\n`;
  texto += `Cliente: ${nome}\nEndereço: ${endereco}\n\n`;

  let total = frete;

  for (let k in carrinho){
    const c = carrinho[k];
    if(c.q){
      const v = produtos[c.id].precos[c.u] * c.q;
      total += v;
      texto += `- ${produtos[c.id].nome} ${c.q} ${c.u} | R$ ${v.toFixed(2)}\n`;
    }
  }

  texto += `\nFrete: R$ ${frete.toFixed(2)}`;
  texto += `\nTOTAL: R$ ${total.toFixed(2)}`;

  const msg = encodeURIComponent(texto);
  window.open(`https://wa.me/5511942718355?text=${msg}`, "_blank");
}


