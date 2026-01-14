// ===== PROTEÇÃO DO ADMIN =====
if (localStorage.getItem("admin") !== "ok") {
  window.location.href = "login.html";
}

// ===== LINK DA PLANILHA (EDITÁVEL) =====
const SHEET_EDIT =
  "https://docs.google.com/spreadsheets/d/1lKBi3XyQ0EqvXjU42w9vz_5AnNKJKrFvGQYOCRPPkWQ/edit";

// ===== LINK DO CSV (SITE USA ESSE) =====
const SHEET_CSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmhL8hBgWNEZQ9_-rnyr5GSph5ixlpmC4kZAln-wFxIXjCSFySGTbUa0BfpSV3DoScj57e2oCR-wDK/pub?output=csv";

// ===== ABRIR PLANILHA =====
function abrirPlanilha() {
  window.open(SHEET_EDIT, "_blank");
}

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem("admin");
  window.location.href = "login.html";
}

// ===== TESTE DE CONEXÃO COM CSV =====
async function testarCSV() {
  try {
    const r = await fetch(SHEET_CSV, { cache: "no-store" });
    if (!r.ok) throw new Error("Falha no CSV");
    console.log("✅ Planilha conectada com sucesso");
  } catch (e) {
    alert("Erro ao conectar com a planilha");
    console.error(e);
  }
}

testarCSV();

