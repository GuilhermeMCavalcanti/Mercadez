/**
 * login.js — Mercadez
 *
 * Fluxo:
 *  1. Usuário submete o formulário de login.
 *  2. POST /usuarios/login  → recebe { token, tipo, id, nome, email, ... }
 *  3. GET  /usuarios/me     → recebe { id, nome, email, cpf, criadoEm, ... }
 *  4. Salva objeto completo em localStorage com a chave "usuarioLogado".
 *  5. Redireciona para perfil.html.
 */

(function () {
  'use strict';

  /* ── Configuração ── */
  const API_BASE = 'https://mercadez-backend-0gah.onrender.com';

  /* ── Utilitários de UI ── */

  function setFieldError(inputEl, errorEl, msg) {
    inputEl.classList.remove('is-valid');
    inputEl.classList.add('is-invalid');
    errorEl.textContent = msg;
    errorEl.classList.add('visible');
  }

  function clearFieldError(inputEl, errorEl) {
    inputEl.classList.remove('is-invalid');
    inputEl.classList.add('is-valid');
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }

  function clearAllErrors(form) {
    form.querySelectorAll('input').forEach(function (inp) {
      inp.classList.remove('is-invalid', 'is-valid');
    });
    form.querySelectorAll('.field-error').forEach(function (el) {
      el.textContent = '';
      el.classList.remove('visible');
    });
  }

  function setSubmitLoading(btn, loading) {
    btn.disabled = loading;
    btn.textContent = loading ? 'Entrando…' : 'Entrar';
  }

  /* ── Validação básica dos campos ── */

  function validarFormLogin(emailEl, senhaEl) {
    const emailErr = document.getElementById('login-email-error');
    const senhaErr = document.getElementById('login-senha-error');
    let ok = true;

    if (!emailEl.value.trim()) {
      setFieldError(emailEl, emailErr, 'Informe o e-mail.');
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      setFieldError(emailEl, emailErr, 'E-mail inválido.');
      ok = false;
    } else {
      clearFieldError(emailEl, emailErr);
    }

    if (!senhaEl.value) {
      setFieldError(senhaEl, senhaErr, 'Informe a senha.');
      ok = false;
    } else {
      clearFieldError(senhaEl, senhaErr);
    }

    return ok;
  }

  /* ── Requisições ao backend ── */

  async function postLogin(email, senha) {
    const res = await fetch(API_BASE + '/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, senha: senha }),
    });

    const data = await res.json();

    if (!res.ok) {
      // O backend retorna { mensagem: "..." } nos erros
      const msg = data.mensagem || 'Credenciais inválidas.';
      throw new Error(msg);
    }

    return data; // { token, tipo, perfil, id, nome, email }
  }

  async function getMe(token) {
    const res = await fetch(API_BASE + '/usuarios/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    });

    if (!res.ok) {
      // Falha silenciosa: retorna null e usaremos só os dados do login
      return null;
    }

    return await res.json(); // { id, nome, email, cpf, criadoEm, perfil }
  }

  /* ── Handler principal do formulário ── */

  async function handleLogin(e) {
    e.preventDefault();

    const form    = document.getElementById('formLogin');
    const emailEl = document.getElementById('login-email');
    const senhaEl = document.getElementById('login-senha');
    const btnEl   = form.querySelector('[type="submit"]');

    clearAllErrors(form);

    if (!validarFormLogin(emailEl, senhaEl)) return;

    setSubmitLoading(btnEl, true);

    try {
      /* 1. Autenticar */
      const loginData = await postLogin(emailEl.value.trim(), senhaEl.value);

      /* 2. Buscar dados completos (cpf, criadoEm) */
      const meData = await getMe(loginData.token);

      /* 3. Montar objeto compatível com perfil.html */
      const usuario = {
        id:           meData ? meData.id           : loginData.id,
        nome:         meData ? meData.nome          : loginData.nome,
        email:        meData ? meData.email         : loginData.email,
        cpf:          meData ? meData.cpf           : null,
        perfil:       meData ? meData.perfil        : loginData.perfil,
        dataCadastro: meData ? meData.criadoEm      : null,
        token:        loginData.token,
        tokenTipo:    loginData.tipo,
      };

      /* 4. Persistir no localStorage */
      localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

      /* 5. Redirecionar para o perfil */
      window.location.href = './perfil.html';

    } catch (err) {
      /* Erros de credenciais ou de rede */
      const emailErr = document.getElementById('login-email-error');
      const senhaErr = document.getElementById('login-senha-error');

      const msg = err.message || 'Não foi possível conectar ao servidor.';

      // Mensagens de credenciais → exibe no campo senha
      if (/credencial|senha|e-mail|email|inválid/i.test(msg)) {
        setFieldError(senhaEl, senhaErr, msg);
      } else {
        // Erros genéricos (rede, servidor) → exibe no campo email
        setFieldError(emailEl, emailErr, msg);
      }
    } finally {
      setSubmitLoading(btnEl, false);
    }
  }

  /* ── Inicialização ── */

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formLogin');
    if (!form) return;
    form.addEventListener('submit', handleLogin);
  });
})();