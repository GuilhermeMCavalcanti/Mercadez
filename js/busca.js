const CATALOGO_DEMO = [
  { nome: "Arroz Camil 5kg",         preco: "22,90", mercado: "Supermercado Extra",    promocao: true  },
  { nome: "Arroz Tio João 5kg",      preco: "24,50", mercado: "Mercadão do Bairro",    promocao: false },
  { nome: "Arroz Camil 1kg",         preco: "5,49",  mercado: "Atacadão",              promocao: true  },
  { nome: "Feijão Kicaldo 1kg",      preco: "7,99",  mercado: "Supermercado Extra",    promocao: true  },
  { nome: "Feijão Kicaldo 500g",     preco: "4,29",  mercado: "Mercadão do Bairro",    promocao: false },
  { nome: "Feijão Carioca 1kg",      preco: "8,50",  mercado: "Atacadão",              promocao: false },
  { nome: "Açúcar Cristal 1kg",      preco: "3,49",  mercado: "Supermercado Extra",    promocao: true  },
  { nome: "Açúcar Cristal 5kg",      preco: "15,90", mercado: "Atacadão",              promocao: true  },
  { nome: "Açúcar União 1kg",        preco: "3,99",  mercado: "Mercadão do Bairro",    promocao: false },
  { nome: "Macarrão Renata 500g",    preco: "3,99",  mercado: "Supermercado Extra",    promocao: true  },
  { nome: "Macarrão Renata 1kg",     preco: "7,49",  mercado: "Atacadão",              promocao: true  },
  { nome: "Macarrão Adria 500g",     preco: "4,29",  mercado: "Mercadão do Bairro",    promocao: false },
  { nome: "Leite Integral 1L",       preco: "4,99",  mercado: "Supermercado Extra",    promocao: true  },
  { nome: "Leite Italac 1L",         preco: "5,29",  mercado: "Mercadão do Bairro",    promocao: false },
  { nome: "Óleo de Soja 900ml",      preco: "6,49",  mercado: "Atacadão",              promocao: true  },
  { nome: "Óleo Liza 900ml",         preco: "6,99",  mercado: "Supermercado Extra",    promocao: false },
  { nome: "Café Pilão 500g",         preco: "13,90", mercado: "Supermercado Extra",    promocao: true  },
  { nome: "Café 3 Corações 500g",    preco: "14,50", mercado: "Mercadão do Bairro",    promocao: false },
  { nome: "Sal Refinado 1kg",        preco: "2,29",  mercado: "Atacadão",              promocao: true  },
  { nome: "Farinha de Trigo 1kg",    preco: "4,19",  mercado: "Supermercado Extra",    promocao: false },
  { nome: "Molho de Tomate 340g",    preco: "2,99",  mercado: "Mercadão do Bairro",    promocao: true  },
  { nome: "Azeite Gallo 500ml",      preco: "28,90", mercado: "Supermercado Extra",    promocao: true  },
  { nome: "Manteiga Aviação 200g",   preco: "8,99",  mercado: "Atacadão",              promocao: false },
  { nome: "Sabão em Pó Omo 1kg",     preco: "17,90", mercado: "Supermercado Extra",    promocao: true  },
  { nome: "Detergente Ypê 500ml",    preco: "1,99",  mercado: "Mercadão do Bairro",    promocao: true  },
];

let produtosAPI = [];

async function carregarProdutosDaAPI() {
  try {
    const response = await fetch(`${API_URL}/produtos`);
    if (!response.ok) throw new Error();
    const data = await response.json();
    produtosAPI = data.map((p) => ({
      nome:    p.nomeProduto,
      preco:   Number(p.preco).toFixed(2).replace(".", ","),
      mercado: p.mercado || "Mercadez",
      promocao: false,
    }));
  } catch (err) {
    console.warn("Não foi possível carregar produtos da API.", err);
    produtosAPI = [];
  }
}

function buscarProdutos(termo) {
  const t = termo.toLowerCase();

  const daAPI = produtosAPI.filter(p => p.nome.toLowerCase().includes(t));

  const doDemo = CATALOGO_DEMO.filter(p => p.nome.toLowerCase().includes(t));

  const nomesAPI = new Set(daAPI.map(p => p.nome.toLowerCase()));
  const demoFiltrado = doDemo.filter(p => !nomesAPI.has(p.nome.toLowerCase()));

  return [...daAPI, ...demoFiltrado];
}
function mostrarToast(mensagem, tipo = "sucesso") {
  const toastExistente = document.getElementById("toast-mercadez");
  if (toastExistente) toastExistente.remove();
  const toast = document.createElement("div");
  toast.id = "toast-mercadez";
  toast.innerText = mensagem;
  toast.style.cssText = `
    position: fixed; bottom: 30px; right: 30px; padding: 14px 22px;
    border-radius: 10px; font-weight: bold; font-size: 15px; color: white;
    z-index: 9999; box-shadow: 0 4px 14px rgba(0,0,0,0.25); transition: opacity 0.4s ease;
    background-color: ${tipo === "sucesso" ? "#27ae60" : tipo === "erro" ? "#e74c3c" : "#f39c12"};
  `;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 400); }, 3500);
}

function exibirResultados(resultados, termo) {
  const modalExistente = document.getElementById("modal-busca");
  if (modalExistente) modalExistente.remove();

  const temPromocao = resultados.some(p => p.promocao);

  const modal = document.createElement("div");
  modal.id = "modal-busca";
  modal.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;
    background:rgba(0,0,0,0.5);z-index:9998;display:flex;align-items:center;justify-content:center;`;

  const bannerPromocao = temPromocao ? `
    <div style="background:linear-gradient(135deg,#ff6b35,#f7c59f);
                border-radius:10px;padding:10px 16px;margin-bottom:16px;
                display:flex;align-items:center;gap:10px;
                box-shadow:0 2px 8px rgba(255,107,53,0.3);">
      <span style="font-size:22px;">🔥</span>
      <div>
        <div style="font-weight:bold;color:white;font-size:15px;">PROMOÇÕES</div>
        <div style="color:rgba(255,255,255,0.9);font-size:12px;">Ofertas especiais encontradas para você!</div>
      </div>
      <span style="margin-left:auto;background:white;color:#ff6b35;
                   font-weight:bold;padding:4px 10px;border-radius:20px;font-size:12px;">
        ${resultados.filter(p => p.promocao).length} oferta(s)
      </span>
    </div>` : "";

  const listaHTML = resultados.length === 0
    ? `<div style="text-align:center;padding:20px;">
         <div style="font-size:48px;">🔍</div>
         <h3>Nenhum resultado encontrado</h3>
         <p style="color:#666;">Nenhum produto para "<strong>${termo}</strong>".</p>
       </div>`
    : resultados.map(p => `
        <div style="display:flex;justify-content:space-between;align-items:center;
                    padding:12px 16px;border-bottom:1px solid #eee;
                    background:${p.promocao ? "#fff9f0" : "#fff"};">
          <div>
            <div style="display:flex;align-items:center;gap:6px;">
              <strong>${p.nome}</strong>
              ${p.promocao ? `<span style="background:#ff6b35;color:white;font-size:10px;
                font-weight:bold;padding:2px 6px;border-radius:10px;">PROMO</span>` : ""}
            </div>
            <small style="color:#888;">📍 ${p.mercado}</small>
          </div>
          <span style="font-size:18px;font-weight:bold;color:${p.promocao ? "#ff6b35" : "#27ae60"};">
            R$ ${p.preco}
          </span>
        </div>`).join("");

  modal.innerHTML = `
    <div style="background:white;border-radius:14px;padding:24px;max-width:560px;width:92%;
                max-height:82vh;overflow-y:auto;box-shadow:0 8px 30px rgba(0,0,0,0.2);">
      ${bannerPromocao}
      <h3 style="margin:0 0 14px;font-size:16px;">
        🛒 ${resultados.length} resultado(s) para "<strong>${termo}</strong>"
      </h3>
      ${listaHTML}
      <button onclick="document.getElementById('modal-busca').remove()"
        style="margin-top:20px;width:100%;padding:12px;border:none;background:#ffc942;
               border-radius:8px;font-weight:bold;cursor:pointer;font-size:15px;">Fechar</button>
    </div>`;

  document.body.appendChild(modal);
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
}

function abrirMenu() {
  document.getElementById("menuLateral").classList.add("ativo");
}

function fecharMenu() {
  document.getElementById("menuLateral").classList.remove("ativo");
}


document.addEventListener("DOMContentLoaded", async () => {
  await carregarProdutosDaAPI();

  function buscar(termo) {
    if (!termo) { mostrarToast("Digite algo para buscar!", "aviso"); return; }
    const resultados = buscarProdutos(termo);
    exibirResultados(resultados, termo);
  }

  const inputNav = document.querySelector(".pesquisa input");
  if (inputNav) {
    inputNav.addEventListener("keypress", (e) => {
      if (e.key === "Enter") buscar(inputNav.value.trim());
    });
  }


  const inputHero = document.querySelector(".hero-busca input");
  const btnHero   = document.querySelector(".hero-busca button");
  if (inputHero && btnHero) {
    btnHero.addEventListener("click", () => buscar(inputHero.value.trim()));
    inputHero.addEventListener("keypress", (e) => {
      if (e.key === "Enter") buscar(inputHero.value.trim());
    });
  }
});