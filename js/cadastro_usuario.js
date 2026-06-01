// =============================================================
// CADASTRO DE USUÁRIO - login_cadastro.html
// Form ID : #formCadastro
// Input IDs: #cadastro-nome, #cadastro-email,
//            #cadastro-cpf, #cadastro-senha
// Endpoint : POST /usuarios/cadastro
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

  // ─── Input mascara ────────────────────────────────────────────

  /**
   * cpf bonitinho
   *
   * @param {HTMLInputElement} input
   */
  function applyCpfMask(input) {
    input.addEventListener('input', () => {
      let v = input.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 9)      v = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9)}`;
      else if (v.length > 6) v = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`;
      else if (v.length > 3) v = `${v.slice(0,3)}.${v.slice(3)}`;
      input.value = v;
    });
  }

  // ─── Regras validação ───────────────────────────────────────

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Verificando o cpf validos somente
   *
   * @param {string} cpf
   * @returns {boolean}
   */
  function validateCpf(cpf) {
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false;

    const calcDigit = (slice, factor) => {
      const sum = slice
        .split('')
        .reduce((acc, d, i) => acc + parseInt(d) * (factor - i), 0);
      const remainder = (sum * 10) % 11;
      return remainder >= 10 ? 0 : remainder;
    };

    const firstDigit  = calcDigit(digits.slice(0, 9),  10);
    const secondDigit = calcDigit(digits.slice(0, 10), 11);

    return (
      firstDigit  === parseInt(digits[9]) &&
      secondDigit === parseInt(digits[10])
    );
  }

  /**
   * senha:
   *  - 8 caracteres minimo
   *  - uma maiuscula (minimo)
   *  - uma minuscula (minimo)
   *  - pelo menos 1 numero
   *
   * @param {string} password
   * @returns {{ valid: boolean, message: string }}
   */
  function validatePassword(password) {
    if (password.length < 8) {
      return { valid: false, message: 'A senha deve ter pelo menos 8 caracteres.' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'A senha deve conter pelo menos uma letra maiúscula.' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'A senha deve conter pelo menos uma letra minúscula.' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'A senha deve conter pelo menos um número.' };
    }
    return { valid: true, message: '' };
  }

  /**
   * Validando os forms
   */
  function validateCadastroForm(nomeInput, emailInput, cpfInput, senhaInput) {
    let isValid = true;

    // Nome
    if (!nomeInput.value.trim()) {
      setInvalid(nomeInput, 'O nome é obrigatório.');
      isValid = false;
    } else {
      setValid(nomeInput);
    }

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

    // CPF
    if (!cpfInput.value.trim()) {
      setInvalid(cpfInput, 'O CPF é obrigatório.');
      isValid = false;
    } else if (!validateCpf(cpfInput.value)) {
      setInvalid(cpfInput, 'CPF inválido. Verifique os dígitos informados.');
      isValid = false;
    } else {
      setValid(cpfInput);
    }

    // Senha
    const passwordResult = validatePassword(senhaInput.value);
    if (!senhaInput.value) {
      setInvalid(senhaInput, 'A senha é obrigatória.');
      isValid = false;
    } else if (!passwordResult.valid) {
      setInvalid(senhaInput, passwordResult.message);
      isValid = false;
    } else {
      setValid(senhaInput);
    }

    return isValid;
  }

  // ─── Bootstrap ──────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCadastro');
    if (!form) return; // Script may be loaded on other pages — do nothing.

    // Scoped references using the unique prefixed IDs from login_cadastro.html
    const nomeInput  = form.querySelector('#cadastro-nome');
    const emailInput = form.querySelector('#cadastro-email');
    const cpfInput   = form.querySelector('#cadastro-cpf');
    const senhaInput = form.querySelector('#cadastro-senha');

    // Apply the CPF input mask
    applyCpfMask(cpfInput);

    // Clear field-level errors while the user types
    [nomeInput, emailInput, cpfInput, senhaInput].forEach((input) => {
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

      if (!validateCadastroForm(nomeInput, emailInput, cpfInput, senhaInput)) return;

      const payload = {
        nome:  nomeInput.value.trim(),
        email: emailInput.value.trim(),
        cpf:   cpfInput.value.trim(),
        senha: senhaInput.value,
      };

      const btnSubmit = form.querySelector("button[type='submit']");
      btnSubmit.disabled = true;
      btnSubmit.textContent = 'Cadastrando...';

      try {
        const response = await fetch(`${API_URL}/usuarios/cadastro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          mostrarToast('Cadastro realizado com sucesso! 🎉', 'sucesso');
          form.reset();
          clearValidation(form);
          setTimeout(() => (window.location.href = './login_cadastro.html'), 2000);
        } else {
          const erro = await response.json().catch(() => null);
          mostrarToast('Erro: ' + (erro?.mensagem || 'tente novamente.'), 'erro');
        }
      } catch (err) {
        mostrarToast('Não foi possível conectar ao servidor.', 'erro');
        console.error('[Cadastro Usuário]', err);
      } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Cadastrar';
      }
    });
  });
})();