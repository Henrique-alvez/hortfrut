if (localStorage.getItem("admin") !== "ok") {
  location.href = "admin.html";
}

let produtos = JSON.parse(localStorage.getItem("produtos")) || {};
let editando = null;

const lista = document.getElementById("lista");

function salvar(){
  if(!nome.value) return alert("Informe o nome");

  const id = editando || nome.value.toLowerCase().replace(/\s+/g,"-");

  produtos[id] = {
    nome: nome.value,
    precos: {}
  };

  if(kg.value) produtos[id].precos.Kg = +kg.value;
  if(un.value) produtos[id].precos.Un = +un.value;
  if(dz.value) produtos[id].precos.Dz = +dz.value;
  if(cx.value) produtos[id].precos.Cx = +cx.value;

  localStorage.setItem("produtos", JSON.stringify(produtos));
  limpar();
  render();
}

function render(){
  lista.innerHTML = "";

  for(let id in produtos){
    const p = produtos[id];
    lista.innerHTML += `
      <div class="card">
        <div>
          <strong>${p.nome}</strong><br>
          <small>
            ${Object.entries(p.precos).map(([u,v])=>`${u}: R$ ${v}`).join(" | ")}
          </small>
        </div>
        <div>
          <button class="edit" onclick="editar('${id}')">Editar</button>
          <button class="del" onclick="excluir('${id}')">Excluir</button>
        </div>
      </div>
    `;
  }
}

function editar(id){
  const p = produtos[id];
  editando = id;
  nome.value = p.nome;
  kg.value = p.precos.Kg || "";
  un.value = p.precos.Un || "";
  dz.value = p.precos.Dz || "";
  cx.value = p.precos.Cx || "";
}

function excluir(id){
  if(confirm("Excluir produto?")){
    delete produtos[id];
    localStorage.setItem("produtos", JSON.stringify(produtos));
    render();
  }
}

function limpar(){
  nome.value = kg.value = un.value = dz.value = cx.value = "";
  editando = null;
}

function logout(){
  localStorage.removeItem("admin");
  location.href = "admin.html";
}

render();
