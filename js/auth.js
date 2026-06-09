/**
 * auth.js — Mercadez
 * Gerencia o estado de login no navbar em todas as páginas.
 * Inclua este script em todas as páginas HTML.
 */

(function () {
  'use strict';

  function getUsuario() {
    try {
      return JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    } catch (e) {
      return null;
    }
  }

  function sair() {
    if (confirm('Deseja realmente sair da sua conta?')) {
      localStorage.removeItem('usuarioLogado');
      window.location.href = './login_cadastro.html';
    }
  }

  function atualizarNavbar() {
    const usuario = getUsuario();

    // Procura o link de Login no navbar
    const navLinks = document.querySelectorAll('a[href="./login_cadastro.html"], a[href="login_cadastro.html"]');

    navLinks.forEach(function (link) {
      // Ignora links do footer e menu lateral
      if (link.closest('footer') || link.closest('.footer-nav')) return;

      if (usuario) {
        const nome = usuario.nome || 'Perfil';
        const perfil = usuario.perfil;
        const paginaPerfil = perfil === 'AFILIADO' ? './perfil.html' : './perfil.html';

        // Substitui o link de Login por nome do usuário + sair
        const wrapper = document.createElement('span');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '8px';

        const linkPerfil = document.createElement('a');
        linkPerfil.href = paginaPerfil;
        linkPerfil.textContent = '👤 ' + nome.split(' ')[0]; // Só o primeiro nome
        linkPerfil.style.fontWeight = '600';

        const btnSair = document.createElement('a');
        btnSair.href = '#';
        btnSair.textContent = 'Sair';
        btnSair.style.color = '#c0392b';
        btnSair.addEventListener('click', function (e) {
          e.preventDefault();
          sair();
        });

        wrapper.appendChild(linkPerfil);
        wrapper.appendChild(document.createTextNode(' | '));
        wrapper.appendChild(btnSair);

        const li = link.closest('li');
        if (li) {
          li.innerHTML = '';
          li.appendChild(wrapper);
        } else {
          link.replaceWith(wrapper);
        }
      }
    });

    // Esconde "Seja Afiliado" se já estiver logado como afiliado
    if (usuario && usuario.perfil === 'AFILIADO') {
      document.querySelectorAll('a[href="./cadastro_afiliado.html"]').forEach(function (el) {
        const li = el.closest('li');
        if (li) li.style.display = 'none';
      });
    }
  }

  document.addEventListener('DOMContentLoaded', atualizarNavbar);
})();
