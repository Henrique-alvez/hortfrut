fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRmhL8hBgWNEZQ9_-rnyr5GSph5ixlpmC4kZAln-wFxIXjCSFySGTbUa0BfpSV3DoScj57e2oCR-wDK/pub?output=csv")
  .then(res => res.text())
 linhas.forEach(l => {
  const parts = l.includes(";") ? l.split(";") : l.split(",");
  let [id, nome, kg, un, dz, cx, ativo] = parts;

  if (!id || !nome) return;
  if (!ativo || ativo.trim().toLowerCase() !== "sim") return;

  id = id.trim().toLowerCase();
  nome = nome.trim();

  produtos[id] = {
    nome,
    precos: {}
  };

  if (kg) produtos[id].precos.Kg = Number(kg.replace(",", "."));
  if (un) produtos[id].precos.Un = Number(un.replace(",", "."));
  if (dz) produtos[id].precos.Dz = Number(dz.replace(",", "."));
  if (cx) produtos[id].precos.Cx = Number(cx.replace(",", "."));
});
