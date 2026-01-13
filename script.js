let produtos = {};
let carrinho = {};

const API_KEY = "AIzaSyC54WUG4EqN3mFkYuEhpZbrzQoKatFf4pc";
const SHEET_ID = "1lKBi3XyQ0EqvXjU42w9vz_5AnNKJKrFvGQYOCRPPkWQ";
const RANGE = "produtos!A2:G";

const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (!data.values) throw new Error("Planilha vazia");

    data.values.forEach(linha => {
      const [id, nome, kg, un, dz, cx, ativo] = linha;

      if (!id || ativo !== "sim") return;

      produtos[id] = {
        nome,
        precos: {}
      };

      if (kg) produtos[id].precos.Kg = Number(kg);
      if (un) produtos[id].precos.Un = Number(un);
      if (dz) produtos[id].precos.Dz = Number(dz);
      if (cx) produtos[id].precos.Cx = Number(cx);
    });

    renderProdutos();
  })
  .catch(err => {
    console.error(err);
    document.getElementById("produtos").innerHTML =
      "<p style='color:red'>Erro ao carregar produtos</p>";
  });
