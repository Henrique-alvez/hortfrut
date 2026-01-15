const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmhL8hBgWNEZQ9_-rnyr5GSph5ixlpmC4kZAln-wFxIXjCSFySGTbUa0BfpSV3DoScj57e2oCR-wDK/pub?output=csv";

let produtos = {};
let carrinho = {};

document.addEventListener("DOMContentLoaded", carregarProdutos);

function carregarProdutos() {
  fetch(CSV_URL)
    .then(r => r.text())
    .then(csv => {
      const linhas = csv.trim().split(/\r?\n/);
      const separador = linhas[0].includes(";") ? ";" : ",";
      const headers = linhas.shift().
