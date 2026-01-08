let produtos = JSON.parse(localStorage.getItem("produtos")) || {};
const lista = document.getElementById("listaProdutos");

function render(){
  lista.innerHTML = "";
  for (let id in produtos){
    lista.innerHTML += `
      <div class="item-admin">
        <strong>${produtos[id].nome}</strong>
        <button onclick="editar('${id}')">Editar</button>
        <button onclick="excluir('${id}')">Excluir</button>
      </div>
    `;
  }
}

function salvar(){
  if(!nome.value) return alert("Informe o nome do produto");

  produtos[nome.value.toLowerCase()] = {
    nome: nome.value,
    precos:{
      ...(kg.value && {Kg:+kg.value}),
      ...(un.value && {Un:+un.value}),
      ...(dz.value && {Dz:+dz.value}),
      ...(cx.value && {Cx:+cx.value})
    }
  };

  localStorage.setItem("produtos", JSON.stringify(produtos));
  limpar();
  render();
}

function editar(id){
  const p = produtos[id];
  nome.value = p.nome;
  kg.value = p.precos.Kg || "";
  un.value = p.precos.Un || "";
  dz.value = p.precos.Dz || "";
  cx.value = p.precos.Cx || "";
}

function excluir(id){
  if(confirm("Remover este produto?")){
    delete produtos[id];
    localStorage.setItem("produtos", JSON.stringify(produtos));
    render();
  }
}

function limpar(){
  nome.value = kg.value = un.value = dz.value = cx.value = "";
}

render();
