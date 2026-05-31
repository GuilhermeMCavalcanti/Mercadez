// ==============================================
// LOGIN - login.html
// IDs do HTML: email_user, senha_user
// Tenta /usuarios/login, depois /afiliados/login
// ==============================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formLogin");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email_user").value.trim();
    const senha = document.getElementById("senha_user").value;

    const btnSubmit = form.querySelector("button[type='submit']");
    btnSubmit.disabled = true;
    btnSubmit.textContent = "Entrando...";

    try {
      // 1. Tenta login como usuário comum
      let response = await fetch(`${API_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        const usuario = await response.json();
        sessionStorage.setItem("usuario", JSON.stringify(usuario));
        sessionStorage.setItem("tipoLogin", "usuario");
        mostrarToast(`Bem-vindo, ${usuario.nome}! ✅`, "sucesso");
        setTimeout(() => (window.location.href = "./index.html"), 1500);
        return;
      }

      // 2. Tenta login como afiliado
      response = await fetch(`${API_URL}/afiliados/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        const afiliado = await response.json();
        sessionStorage.setItem("afiliado", JSON.stringify(afiliado));
        sessionStorage.setItem("tipoLogin", "afiliado");
        mostrarToast(`Bem-vindo, ${afiliado.nome}! ✅`, "sucesso");
        setTimeout(() => (window.location.href = "./cadastro_produtos.html"), 1500);
        return;
      }

      mostrarToast("Email ou senha incorretos.", "erro");

    } catch (err) {
      mostrarToast("Não foi possível conectar ao servidor.", "erro");
      console.error(err);
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = "Entrar";
    }
  });
});
