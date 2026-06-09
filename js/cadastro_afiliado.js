// =============================================================
// CADASTRO DE AFILIADO - cadastro_afiliado.html
// Form ID : #formAfiliado
// Input IDs: #af-nomeProprietario, #af-email, #af-cnpj,
//            #af-endereco, #af-telefone, #af-mercado,
//            #af-categoria, #af-funcionarios, #af-senha
// Endpoint : POST /afiliados
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

  // ─── Input masks ────────────────────────────────────────────

  /**
   * cnpj mascara (pra ficar bonito)
   * @param {HTMLInputElement} input
   */
  function applyCnpjMask(input) {
    input.addEventListener('input', () => {
      let v = input.value.replace(/\D/g, '').slice(0, 14);
      if (v.length > 12)      v = `${v.slice(0,2)}.${v.slice(2,5)}.${v.slice(5,8)}/${v.slice(8,12)}-${v.slice(12)}`;
      else if (v.length > 8)  v = `${v.slice(0,2)}.${v.slice(2,5)}.${v.slice(5,8)}/${v.slice(8)}`;
      else if (v.length > 5)  v = `${v.slice(0,2)}.${v.slice(2,5)}.${v.slice(5)}`;
      else if (v.length > 2)  v = `${v.slice(0,2)}.${v.slice(2)}`;
      input.value = v;
    });
  }

  /**
   *
   * @param {HTMLInputElement} input
   */
  function applyPhoneMask(input) {
    input.addEventListener('input', () => {
      let v = input.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      else if (v.length > 0) v = `(${v}`;
      input.value = v;
    });
  }

  // ─── Validação ───────────────────────────────────────

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   *
   * @param {string} cnpj 
   * @returns {boolean}
   */
  function validateCnpj(cnpj) {
    const digits = cnpj.replace(/\D/g, '');
    if (digits.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(digits)) return false; 

    const calcDigit = (slice, weights) =>
      slice
        .split('')
        .reduce((acc, d, i) => acc + parseInt(d) * weights[i], 0);

    const mod = (sum) => {
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const firstDigit  = mod(calcDigit(digits.slice(0, 12), w1));
    const secondDigit = mod(calcDigit(digits.slice(0, 13), w2));

    return (
      firstDigit  === parseInt(digits[12]) &&
      secondDigit === parseInt(digits[13])
    );
  }

  /**
   * Validação digitos de telefone
   *
   * @param {string} phone - Raw or masked phone string
   * @returns {boolean}
   */
  function validatePhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10 || digits.length === 11;
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
   * validando os forms
   */
  function validateAfiliadoForm(fields) {
    let isValid = true;

    // E-mail
    if (!fields.email.value.trim()) {
      setInvalid(fields.email, 'O e-mail é obrigatório.');
      isValid = false;
    } else if (!EMAIL_REGEX.test(fields.email.value.trim())) {
      setInvalid(fields.email, 'Informe um e-mail válido.');
      isValid = false;
    } else {
      setValid(fields.email);
    }

    // CNPJ
    if (!fields.cnpj.value.trim()) {
      setInvalid(fields.cnpj, 'O CNPJ é obrigatório.');
      isValid = false;
    } else if (!validateCnpj(fields.cnpj.value)) {
      setInvalid(fields.cnpj, 'CNPJ inválido. Verifique os dígitos informados.');
      isValid = false;
    } else {
      setValid(fields.cnpj);
    }

    // Telefone
    if (!fields.telefone.value.trim()) {
      setInvalid(fields.telefone, 'O telefone é obrigatório.');
      isValid = false;
    } else if (!validatePhone(fields.telefone.value)) {
      setInvalid(fields.telefone, 'Informe um telefone válido com DDD: (00) 00000-0000.');
      isValid = false;
    } else {
      setValid(fields.telefone);
    }

    // Senha
    if (!fields.senha.value) {
      setInvalid(fields.senha, 'A senha é obrigatória.');
      isValid = false;
    } else {
      const passwordResult = validatePassword(fields.senha.value);
      if (!passwordResult.valid) {
        setInvalid(fields.senha, passwordResult.message);
        isValid = false;
      } else {
        setValid(fields.senha);
      }
    }

    return isValid;
  }

  // ─── Bootstrap ──────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formAfiliado');
    if (!form) return;

    // Scoped references using the unique prefixed IDs from cadastro_afiliado.html
    const fields = {
      nomeProprietario: form.querySelector('#af-nomeProprietario'),
      email:            form.querySelector('#af-email'),
      cnpj:             form.querySelector('#af-cnpj'),
      endereco:         form.querySelector('#af-endereco'),
      telefone:         form.querySelector('#af-telefone'),
      mercado:          form.querySelector('#af-mercado'),
      categoria:        form.querySelector('#af-categoria'),
      funcionarios:     form.querySelector('#af-funcionarios'),
      senha:            form.querySelector('#af-senha'),
    };

    // Apply input masks
    applyCnpjMask(fields.cnpj);
    applyPhoneMask(fields.telefone);

    // Clear field-level errors while the user types
    Object.values(fields).forEach((input) => {
      if (!input) return;
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

      if (!validateAfiliadoForm(fields)) return;

      const payload = {
        nome_proprietario: fields.nomeProprietario.value.trim(),
        email:             fields.email.value.trim(),
        cnpj:              fields.cnpj.value.trim(),
        endereco:          fields.endereco.value.trim(),
        telefone:          fields.telefone.value.trim(),
        mercado:           fields.mercado.value.trim(),
        categoria:         fields.categoria.value.trim(),
        funcionarios:      fields.funcionarios.value ? parseInt(fields.funcionarios.value) : null,
        senha:             fields.senha.value,
      };

      const btnSubmit = form.querySelector("button[type='submit']");
      btnSubmit.disabled = true;
      btnSubmit.textContent = 'Cadastrando...';

      try {
        const response = await fetch(`${API_URL}/afiliados`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          mostrarToast('Afiliado cadastrado com sucesso! 🎉', 'sucesso');
          form.reset();
          clearValidation(form);
          setTimeout(() => (window.location.href = './login_cadastro.html'), 2000);
        } else {
          const erro = await response.json().catch(() => null);
          mostrarToast('Erro: ' + (erro?.mensagem || 'tente novamente.'), 'erro');
        }
      } catch (err) {
        mostrarToast('Não foi possível conectar ao servidor.', 'erro');
        console.error('[Cadastro Afiliado]', err);
      } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Cadastrar';
      }
    });
  });
})();