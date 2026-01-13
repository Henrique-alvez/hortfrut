fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRmhL8hBgWNEZQ9_-rnyr5GSph5ixlpmC4kZAln-wFxIXjCSFySGTbUa0BfpSV3DoScj57e2oCR-wDK/pub?output=csv")
  .then(res => res.text())
  .then(texto => {
    const linhas = texto.trim().split("\n").slice(1);
    linhas.forEach(linha => {
      const parts = linha.includes(";") ? linha.split(";") : linha.split(",");
      const [id, nome, kg, un, dz, cx, ativo] = parts;

      if (ativo !== "sim") return;

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
    document.getElementById("produtos").innerHTML =
      "<p style='color:red;font-weight:bold'>Erro ao carregar produtos</p>";
  });
