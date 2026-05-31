// ==============================================
// CADASTRO DE USUÁRIO - form_cadastro.html
// POST /usuarios/cadastro
// IDs do HTML: name_user, email_user, cpf_user, senha_user
// ==============================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCadastro");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      nome:  document.getElementById("name_user").value.trim(),
      email: document.getElementById("email_user").value.trim(),
      senha: document.getElementById("senha_user").value,
      cpf:   document.getElementById("cpf_user")?.value.trim() || null,
    };

    const btnSubmit = form.querySelector("button[type='submit']");
    btnSubmit.disabled = true;
    btnSubmit.textContent = "Cadastrando...";

    try {
      const response = await fetch(`${API_URL}/usuarios/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        mostrarToast("Cadastro realizado com sucesso! 🎉", "sucesso");
        form.reset();
        setTimeout(() => (window.location.href = "./login_cadastro.html"), 2000);
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