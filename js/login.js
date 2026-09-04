/**
 * login.js — Mercadez
 *
 * Fluxo:
 *  1. Usuário submete o formulário de login.
 *  2. Tenta POST /usuarios/login
 *     → Se ok: salva como usuário e redireciona para perfil.html
 *  3. Se falhar (401), tenta POST /afiliados/login
 *     → Se ok: salva como afiliado e redireciona para perfil_afiliado.html
 *  4. Se ambos falharem, exibe erro de credenciais.
 */

(function () {
  'use strict';

  /* ── Configuração ── */
  const API_BASE = API_URL; // usa a mesma URL definida em api.js

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

  // Tenta logar como usuário comum — retorna null se credenciais inválidas (401)
  async function tentarLoginUsuario(email, senha) {
    const res = await fetch(API_BASE + '/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, senha: senha }),
    });

    if (res.status === 401) return null;

    const data = await res.json();
    if (!res.ok) throw new Error(data.mensagem || 'Erro ao conectar.');
    return { ...data, tipo: 'USUARIO' };
  }

  // Tenta logar como afiliado — retorna null se credenciais inválidas (401)
  async function tentarLoginAfiliado(email, senha) {
    const res = await fetch(API_BASE + '/afiliados/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, senha: senha }),
    });

    if (res.status === 401) return null;

    const data = await res.json();
    if (!res.ok) throw new Error(data.mensagem || 'Erro ao conectar.');
    return { ...data, tipo: 'AFILIADO' };
  }

  // Busca dados completos do usuário logado
  async function getMeUsuario(token) {
    const res = await fetch(API_BASE + '/usuarios/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    });
    if (!res.ok) return null;
    return await res.json();
  }

  // Busca dados completos do afiliado logado
  async function getMeAfiliado(token) {
    const res = await fetch(API_BASE + '/afiliados/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
    });
    if (!res.ok) return null;
    return await res.json();
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
      const email = emailEl.value.trim();
      const senha = senhaEl.value;

      /* 1. Tenta como usuário comum */
      let loginData = await tentarLoginUsuario(email, senha);
      let perfil = 'USUARIO';
      let meData = null;

      if (loginData) {
        /* Usuário encontrado */
        meData = await getMeUsuario(loginData.token);
      } else {
        /* 2. Tenta como afiliado */
        loginData = await tentarLoginAfiliado(email, senha);
        if (loginData) {
          perfil = 'AFILIADO';
          meData = await getMeAfiliado(loginData.token);
        }
      }

      /* 3. Se nenhum funcionou, credenciais inválidas */
      if (!loginData) {
        const senhaErr = document.getElementById('login-senha-error');
        setFieldError(senhaEl, senhaErr, 'E-mail ou senha incorretos.');
        return;
      }

      /* 4. Montar objeto e salvar no localStorage */
      const nomeAfiliado = meData ? (meData.nome_proprietario || meData.nome) : loginData.nome;
      const nomeUsuario  = meData ? meData.nome : loginData.nome;

      const usuario = {
        id:           meData ? meData.id          : loginData.id,
        nome:         perfil === 'AFILIADO' ? nomeAfiliado : nomeUsuario,
        email:        meData ? meData.email        : loginData.email,
        cpf:          meData ? meData.cpf          : null,
        cnpj:         meData ? meData.cnpj         : null,
        mercado:      meData ? meData.mercado       : null,
        perfil:       perfil,
        dataCadastro: meData ? meData.criadoEm     : null,
        token:        loginData.token,
        tokenTipo:    loginData.tipo,
      };

      localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

      /* 5. Redirecionar conforme o cargo */
      if (perfil === 'AFILIADO') {
        window.location.href = './perfil.html';
      } else {
        window.location.href = './perfil.html';
      }

    } catch (err) {
      const emailErr = document.getElementById('login-email-error');
      const senhaErr = document.getElementById('login-senha-error');
      const msg = err.message || '';
      if (/credencial|senha|e-mail|email|inválid|401/i.test(msg)) {
        setFieldError(senhaEl, senhaErr, 'E-mail ou senha incorretos.');
      } else {
        setFieldError(emailEl, emailErr, 'Não foi possível conectar ao servidor.');
      }
      console.error('[Login]', err);
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
