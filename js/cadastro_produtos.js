// ==============================================
// CADASTRO DE PRODUTOS - cadastro_produtos.html
// POST /produtos  |  GET /produtos
// IDs: name_prod, tags_prod, price_prod, quant_prod
// ==============================================

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("formProduto");
  if (!form) return;

  const afiliadoStr = sessionStorage.getItem("afiliado");
  if (!afiliadoStr) {
    mostrarToast("Faça login como afiliado primeiro.", "aviso");
    setTimeout(() => (window.location.href = "./login.html"), 1800);
    return;
  }

  const afiliado = JSON.parse(afiliadoStr);
  await carregarProdutos(afiliado);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // price_prod aceita vírgula ou ponto
    const precoStr = document.getElementById("price_prod").value.replace(",", ".");

    const payload = {
      nomeProduto: document.getElementById("name_prod").value.trim(),
      tags:        document.getElementById("tags_prod").value.trim(),
      preco:       parseFloat(precoStr),
      quantidade:  parseInt(document.getElementById("quant_prod").value),
    };

    if (isNaN(payload.preco) || payload.preco <= 0) {
      mostrarToast("Informe um preço válido.", "aviso");
      return;
    }

    const btnSubmit = form.querySelector("button[type='submit']");
    btnSubmit.disabled = true;
    btnSubmit.textContent = "Cadastrando...";

    try {
      const response = await fetch(`${API_URL}/produtos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${afiliado.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        mostrarToast("Produto cadastrado com sucesso! ✅", "sucesso");
        form.reset();
        await carregarProdutos(afiliado);
      } else {
        const erro = await response.json().catch(() => null);
        mostrarToast("Erro: " + (erro?.mensagem || "tente novamente."), "erro");
      }
    } catch (err) {
      mostrarToast("Não foi possível conectar ao servidor.", "erro");
      console.error(err);
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = "Cadastrar";
    }
  });
});

async function carregarProdutos(afiliado) {
  let container = document.getElementById("listaProdutos");
  if (!container) {
    container = document.createElement("div");
    container.id = "listaProdutos";
    container.style.cssText = "margin:24px auto;max-width:700px;padding:0 16px;";
    const section = document.querySelector("section") || document.querySelector("main") || document.body;
    section.appendChild(container);
  }

  container.innerHTML = "<p style='text-align:center;color:#888;'>Carregando produtos...</p>";

  try {
    const url = `${API_URL}/produtos?afiliado=${afiliado.id}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error();
    const produtos = await response.json();

    if (!produtos.length) {
      container.innerHTML = "<p style='text-align:center;color:#aaa;margin-top:16px;'>Nenhum produto cadastrado ainda.</p>";
      return;
    }

    container.innerHTML = `
      <h3 style="text-align:center;margin:24px 0 16px;">Seus produtos (${produtos.length})</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#ffc942;text-align:left;">
            <th style="padding:10px;">Nome</th>
            <th style="padding:10px;">Tags</th>
            <th style="padding:10px;">Preço</th>
            <th style="padding:10px;">Qtd</th>
          </tr>
        </thead>
        <tbody>
          ${produtos.map((p, i) => `
            <tr style="background:${i%2===0?"#fff":"#f9f9f9"};border-bottom:1px solid #eee;">
              <td style="padding:10px;">${p.nomeProduto}</td>
              <td style="padding:10px;color:#888;">${p.tags || "-"}</td>
              <td style="padding:10px;font-weight:bold;color:#27ae60;">R$ ${Number(p.preco).toFixed(2).replace(".",",")}</td>
              <td style="padding:10px;">${p.quantidade}</td>
            </tr>`).join("")}
        </tbody>
      </table>`;
  } catch (err) {
    container.innerHTML = "<p style='text-align:center;color:#e74c3c;'>Não foi possível carregar os produtos.</p>";
    console.error(err);
  }
}
