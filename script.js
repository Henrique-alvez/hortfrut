const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmhL8hBgWNEZQ9_-rnyr5GSph5ixlpmC4kZAln-wFxIXjCSFySGTbUa0BfpSV3DoScj57e2oCR-wDK/pub?output=csv";

const produtos = {};
const area = document.getElementById("produtos");

fetch(urlCSV)
  .then(res => res.text())
  .then(csv => {
    const linhas = csv.trim().split("\n");
    linhas.shift(); // remove cabeçalho

    linhas.forEach(linha => {
      const cols = linha.includes(";")
        ? linha.split(";")
        : linha.split(",");

      let [id, nome, kg, un, dz, cx, ativo] = cols;

      if (!id || !nome) return;
      if (!ativo || ativo.trim().toLowerCase() !== "sim") return;

      id = id.trim().toLowerCase();

      produtos[id] = {
        nome: nome.trim(),
        precos: {}
      };

      if (kg) produtos[id].precos.Kg = Number(kg.replace(",", "."));
      if (un) produtos[id].precos.Un = Number(un.replace(",", "."));
      if (dz) produtos[id].precos.Dz = Number(dz.replace(",", "."));
      if (cx) produtos[id].precos.Cx = Number(cx.replace(",", "."));
    });

    renderProdutos();
  })
  .catch(err => {
    console.error("Erro real:", err);
    area.innerHTML = "<p style='color:red'>Erro ao carregar produtos</p>";
  });

function renderProdutos() {
  area.innerHTML = "";

  for (let id in produtos) {
    const p = produtos[id];
    const unidades = Object.keys(p.precos);

    if (!unidades.length) continue;

    area.innerHTML += `
      <div class="produto">
        <h3>${p.nome}</h3>
        <select>
          ${unidades.map(u => `<option>${u}</option>`).join("")}
        </select>
        <p class="preco">R$ ${p.precos[unidades[0]].toFixed(2)}</p>
      </div>
    `;
  }
}

let carrinho = [];

// ADICIONAR AO CARRINHO
function addCarrinho(nome, preco, unidade, inputId) {
  const qtd = Number(document.getElementById(inputId).value);

  if (!qtd || qtd <= 0) {
    alert("Quantidade inválida");
    return;
  }

  carrinho.push({
    nome,
    preco,
    unidade,
    qtd
  });

  atualizarContador();
}

// CONTADOR DO CARRINHO
function atualizarContador() {
  const totalItens = carrinho.reduce((s, i) => s + i.qtd, 0);
  document.getElementById("cartCount").innerText = totalItens;
}

// ABRIR CARRINHO
function abrirCarrinho() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  let total = 0;

  carrinho.forEach((p, i) => {
    const valor = p.preco * p.qtd;
    total += valor;

    lista.innerHTML += `
      <p>
        ${p.nome} — ${p.qtd} ${p.unidade}
        <strong>R$ ${valor.toFixed(2)}</strong>
        <button onclick="remover(${i})">✕</button>
      </p>
    `;
  });

  document.getElementById("total").innerText =
    "Total: R$ " + total.toFixed(2);

  document.getElementById("modal").style.display = "flex";
}

// FECHAR CARRINHO
function fecharCarrinho() {
  document.getElementById("modal").style.display = "none";
}

// REMOVER ITEM
function remover(i) {
  carrinho.splice(i, 1);
  atualizarContador();
  abrirCarrinho();
}

// FINALIZAR NO WHATSAPP
function finalizar() {
  const nome = document.getElementById("nome").value.trim();
  const endereco = document.getElementById("endereco").value.trim();

  if (!nome || !endereco) {
    alert("Preencha nome e endereço");
    return;
  }

  let texto = `🛒 Pedido - Hortifruti\n`;
  texto += `👤 Cliente: ${nome}\n`;
  texto += `📍 Endereço: ${endereco}\n\n`;
  texto += `Itens:\n`;

  let total = 0;

  carrinho.forEach(p => {
    const v = p.preco * p.qtd;
    total += v;
    texto += `- ${p.nome} (${p.qtd} ${p.unidade}) R$ ${v.toFixed(2)}\n`;
  });

  texto += `\n💰 Total: R$ ${total.toFixed(2)}`;

  const msg = encodeURIComponent(texto);
  const telefone = "5511942718355"; // SEU NÚMERO

  window.open(`https://wa.me/${telefone}?text=${msg}`, "_blank");
}
