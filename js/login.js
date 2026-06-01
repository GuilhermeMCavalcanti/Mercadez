// =============================================================
// LOGIN - login_cadastro.html
// Form ID : #formLogin
// Input IDs: #login-email, #login-senha  (prefixed to be unique)
// Endpoints: POST /usuarios/login  →  POST /afiliados/login
// =============================================================

(() => {
  'use strict';

  // ─── Utility helpers ────────────────────────────────────────

  /**
   *
   * @param {HTMLInputElement} input
   * @param {string} message
   */
  function setInvalid(input, message) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    input.setAttribute('aria-invalid', 'true');

    const errorEl = document.getElementById(`${input.id}-error`);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }

  /**
   *
   * @param {HTMLInputElement} input
   */
  function setValid(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    input.setAttribute('aria-invalid', 'false');

    const errorEl = document.getElementById(`${input.id}-error`);
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  function clearValidation(form) {
    form.querySelectorAll('input').forEach((input) => {
      input.classList.remove('is-invalid', 'is-valid');
      input.removeAttribute('aria-invalid');
      const errorEl = document.getElementById(`${input.id}-error`);
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
    });
  }

  // ─── Validation rules ───────────────────────────────────────

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   *
   * @param {HTMLInputElement} emailInput
   * @param {HTMLInputElement} senhaInput
   * @returns {boolean}
   */
  function validateLoginForm(emailInput, senhaInput) {
    let isValid = true;

    // E-mail
    if (!emailInput.value.trim()) {
      setInvalid(emailInput, 'O e-mail é obrigatório.');
      isValid = false;
    } else if (!EMAIL_REGEX.test(emailInput.value.trim())) {
      setInvalid(emailInput, 'Informe um e-mail válido.');
      isValid = false;
    } else {
      setValid(emailInput);
    }

    // Senha
    if (!senhaInput.value) {
      setInvalid(senhaInput, 'A senha é obrigatória.');
      isValid = false;
    } else {
      setValid(senhaInput);
    }

    return isValid;
  }

  // ─── Bootstrap ──────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formLogin');
    if (!form) return; // Script may be loaded on other pages — do nothing.

    // Scoped references using the unique prefixed IDs from login_cadastro.html
    const emailInput = form.querySelector('#login-email');
    const senhaInput = form.querySelector('#login-senha');

    // Clear field-level errors while the user types
    [emailInput, senhaInput].forEach((input) => {
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid', 'is-valid');
        input.removeAttribute('aria-invalid');
        const errorEl = document.getElementById(`${input.id}-error`);
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.classList.remove('visible');
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      clearValidation(form);

      if (!validateLoginForm(emailInput, senhaInput)) return;

      const email = emailInput.value.trim();
      const senha = senhaInput.value;

      const btnSubmit = form.querySelector("button[type='submit']");
      btnSubmit.disabled = true;
      btnSubmit.textContent = 'Entrando...';

      try {
        // 1. Try login as regular user
        let response = await fetch(`${API_URL}/usuarios/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha }),
        });

        if (response.ok) {
          const usuario = await response.json();
          sessionStorage.setItem('usuario', JSON.stringify(usuario));
          sessionStorage.setItem('tipoLogin', 'usuario');
          mostrarToast(`Bem-vindo, ${usuario.nome}! ✅`, 'sucesso');
          setTimeout(() => (window.location.href = './index.html'), 1500);
          return;
        }

        // 2. Fallback: try login as affiliate
        response = await fetch(`${API_URL}/afiliados/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, senha }),
        });

        if (response.ok) {
          const afiliado = await response.json();
          sessionStorage.setItem('afiliado', JSON.stringify(afiliado));
          sessionStorage.setItem('tipoLogin', 'afiliado');
          mostrarToast(`Bem-vindo, ${afiliado.nome}! ✅`, 'sucesso');
          setTimeout(() => (window.location.href = './cadastro_produtos.html'), 1500);
          return;
        }

        mostrarToast('E-mail ou senha incorretos.', 'erro');
      } catch (err) {
        mostrarToast('Não foi possível conectar ao servidor.', 'erro');
        console.error('[Login]', err);
      } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Entrar';
      }
    });
  });
})();