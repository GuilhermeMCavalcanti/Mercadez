// ==============================================
// CADASTRO DE AFILIADO - cadastro_afiliado.html
// POST /afiliados
// IDs: nomeProprietario, email, cnpj, endereco,
//      telefone, mercado, categoria, funcionarios,
//      pagamento, senha
// ==============================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formAfiliado");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const funcionariosVal = document.getElementById("funcionarios").value;

    const payload = {
      nome_proprietario: document.getElementById("nomeProprietario").value.trim(),
      email:             document.getElementById("email").value.trim(),
      cnpj:              document.getElementById("cnpj").value.trim(),
      endereco:          document.getElementById("endereco").value.trim(),
      telefone:          document.getElementById("telefone").value.trim(),
      mercado:           document.getElementById("mercado").value.trim(),
      categoria:         document.getElementById("categoria").value.trim(),
      funcionarios:      funcionariosVal ? parseInt(funcionariosVal) : null,
      pagamento:         document.getElementById("pagamento").value.trim(),
      senha:             document.getElementById("senha").value,
    };

    const btnSubmit = form.querySelector("button[type='submit']");
    btnSubmit.disabled = true;
    btnSubmit.textContent = "Cadastrando...";

    try {
      const response = await fetch(`${API_URL}/afiliados`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        mostrarToast("Afiliado cadastrado com sucesso! 🎉", "sucesso");
        form.reset();
        setTimeout(() => (window.location.href = "./login.html"), 2000);
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
