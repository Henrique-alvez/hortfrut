let produtos = JSON.parse(localStorage.getItem("produtos")) || {
 banana:{nome:"Banana Prata",precos:{Kg:5.5,Un:1.2,Dz:12,Cx:45}},
 maca:{nome:"Maçã Gala",precos:{Kg:8.9,Un:2.2,Dz:22}},
 tomate:{nome:"Tomate",precos:{Kg:6.5,Cx:52}}
};

let carrinho = {};

const area = document.getElementById("produtos");

for (let id in produtos){
 const p = produtos[id];
 area.innerHTML += `
 <div class="produto">
   <h3>${p.nome}</h3>
   <select id="u-${id}" onchange="preco('${id}')">
     ${Object.keys(p.precos).map(u=>`<option>${u}</option>`)}
   </select>
   <p class="preco" id="p-${id}"></p>
   <div class="controle">
     <button onclick="alt('${id}',-1)">−</button>
     <span id="q-${id}">0</span>
     <button onclick="alt('${id}',1)">+</button>
   </div>
 </div>`;
 preco(id);
}

function preco(id){
 const u = document.getElementById("u-"+id).value;
 document.getElementById("p-"+id).innerText =
 "R$ "+produtos[id].precos[u].toFixed(2);
}

function alt(id,d){
 const u = document.getElementById("u-"+id).value;
 const k = id+"-"+u;
 carrinho[k] ??= {id,u,q:0};
 carrinho[k].q = Math.max(0,carrinho[k].q+d);
 document.getElementById("q-"+id).innerText =
 Object.values(carrinho).filter(i=>i.id==id).reduce((s,i)=>s+i.q,0);
 document.getElementById("cartCount").innerText =
 Object.values(carrinho).reduce((s,i)=>s+i.q,0);
}

function abrirCarrinho(){
 let lista = document.getElementById("lista");
 lista.innerHTML="";
 let total=0;
 for (let i in carrinho){
  let c = carrinho[i];
  if(c.q){
   let pr = produtos[c.id].precos[c.u];
   total += pr*c.q;
   lista.innerHTML+=`<p>${produtos[c.id].nome} ${c.q} ${c.u}</p>`;
  }
 }
 document.getElementById("total").innerText="Subtotal R$ "+total.toFixed(2);
 document.getElementById("modal").style.display="flex";
}

function finalizar(){
 let nome = nome.value;
 let end = endereco.value;
 let frete = +frete.value;
 let msg=`Pedido%0A${nome}%0A${end}%0A`;
 let total=frete;
 for(let i in carrinho){
  let c=carrinho[i];
  if(c.q){
   let pr=produtos[c.id].precos[c.u];
   total+=pr*c.q;
   msg+=`${produtos[c.id].nome} ${c.q} ${c.u}%0A`;
  }
 }
 msg+=`Total R$ ${total.toFixed(2)}`;
 window.open("https://wa.me/5511942718355?text="+msg);
}
