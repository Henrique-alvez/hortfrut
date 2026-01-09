let produtos = JSON.parse(localStorage.getItem("produtos")) || {
  banana:{nome:"Banana Prata",precos:{Kg:5.5,Un:1.2,Dz:12,Cx:45}},
  maca:{nome:"Maçã Gala",precos:{Kg:8.9,Un:2.2,Dz:22}},
  tomate:{nome:"Tomate",precos:{Kg:6.5,Cx:52}}
};

let carrinho = {};
const area = document.getElementById("produtos");

/* LISTAR PRODUTOS */
for (let id in produtos){
  const p = produtos[id];
  area.innerHTML += `
    <div class="produto">
      <h3>${p.nome}</h3>

      <select id="u-${id}" onchange="preco('${id}')">
        ${Object.keys(p.precos).map(u=>`<option>${u}</option>`).join("")}
      </select>

      <p class="preco" id="p-${id}"></p>

      <div class="controle">
        <button onclick="alt('${id}',-1)">−</button>
        <span id="q-${id}">0</span>
        <button onclick="alt('${id}',1)">+</button>
      </div>
    </div>
  `;
  preco(id);
}

/* ATUALIZAR PREÇO */
function preco(id){
  const u = document.getElementById("u-"+id).value;
  document.getElementById("p-"+id).innerText =
    "R$ " + produtos[id].precos[u].toFixed(2);
}

/* ALTERAR CARRINHO */
function alt(id,d){
  const u = document.getElementById("u-"+id).value;
  const k = id+"-"+u;

  carrinho[k] ??= {id,u,q:0};
  carrinho[k].q = Math.max(0, carrinho[k].q + d);

  document.getElementById("q-"+id).innerText =
    Object.values(carrinho).filter(i=>i.id===id).reduce((s,i)=>s+i.q,0);

  document.getElementById("cartCount").innerText =
    Object.values(carrinho).reduce((s,i)=>s+i.q,0);
}

/* ABRIR / FECHAR */
function abrirCarrinho(){
  atualizarCarrinho();
  document.getElementById("modal").style.display = "flex";
}

function fecharCarrinho(){
  document.getElementById("modal").style.display = "none";
}

/* ATUALIZAR CARRINHO */
function atualizarCarrinho(){
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  let total = 0;

  for (let i in carrinho){
    const c = carrinho[i];
    if(c.q){
      const pr = produtos[c.id].precos[c.u];
      const valor = pr * c.q;
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
}

/* FINALIZAR WHATSAPP */
function finalizar(){
  const nome = document.getElementById("nome").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const frete = Number(document.getElementById("frete").value);

  if (!nome || !endereco){
    alert("Preencha nome e endereço");
    return;
  }

  let texto = `Pedido - Hortifruti Verde Vida\n`;
  texto += `Cliente: ${nome}\n`;
  texto += `Endereço: ${endereco}\n\n`;

  let total = frete;

  for (let k in carrinho){
    const c = carrinho[k];
    if(c.q){
      const p = produtos[c.id];
      const v = p.precos[c.u] * c.q;
      total += v;
      texto += `- ${p.nome} ${c.q} ${c.u} | R$ ${v.toFixed(2)}\n`;
    }
  }

  texto += `\nFrete: R$ ${frete.toFixed(2)}`;
  texto += `\nTOTAL: R$ ${total.toFixed(2)}`;

  const msg = encodeURIComponent(texto);
  const tel = "5511942718355"; // SEU NÚMERO

  window.open(`https://wa.me/${tel}?text=${msg}`, "_blank");
}

/* FECHAR AO CLICAR FORA */
modal.onclick = e => e.target.id === "modal" && fecharCarrinho();

/* FECHAR COM ESC */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") fecharCarrinho();
});
