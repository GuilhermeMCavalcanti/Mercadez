// ==============================================
// FALE CONOSCO - fale_conosco.html
// POST /contato
// IDs: nome, email, mensagem
// form class: .form-contato
// ==============================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form-contato");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      nome:     document.getElementById("nome").value.trim(),
      email:    document.getElementById("email").value.trim(),
      mensagem: document.getElementById("mensagem").value.trim(),
    };

    const btnSubmit = form.querySelector("button[type='submit']");
    btnSubmit.disabled = true;
    btnSubmit.textContent = "Enviando...";

    try {
      const response = await fetch(`${API_URL}/contato`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        mostrarToast("Mensagem enviada com sucesso! 📩", "sucesso");
        form.reset();
      } else {
        const erro = await response.json().catch(() => null);
        mostrarToast("Erro: " + (erro?.mensagem || "tente novamente."), "erro");
      }
    } catch (err) {
      mostrarToast("Não foi possível conectar ao servidor.", "erro");
      console.error(err);
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = "Enviar";
    }
  });
});
