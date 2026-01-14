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

function addCarrinho(nome, preco, inputId) {
  const qtd = Number(document.getElementById(inputId).value);

  if (qtd <= 0) {
    alert("Quantidade inválida");
    return;
  }

  carrinho.push({
    nome,
    preco,
    qtd
  });

  alert("Produto adicionado ao carrinho");
}
