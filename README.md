# Mercadez — Mercado Nota Dez!

<p align="center">
  <strong>Uma solução digital para comparação de preços e fortalecimento do comércio local.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Backend-Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/API-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

<p align="center">
  Projeto acadêmico desenvolvido na <strong>FATEC Ferraz de Vasconcelos</strong>.
</p>

---

## Sobre o projeto

O **Mercadez — Mercado Nota Dez** é uma solução web desenvolvida para aproximar **consumidores e pequenos comerciantes**, facilitando a comparação de preços, a divulgação de ofertas e o gerenciamento de produtos.

A plataforma permite que consumidores pesquisem produtos, comparem preços entre diferentes estabelecimentos e encontrem melhores oportunidades de compra.

Para os comerciantes, o Mercadez oferece recursos para cadastrar produtos, atualizar preços, gerenciar estoque, divulgar promoções e ampliar sua presença digital.

O projeto foi desenvolvido no contexto acadêmico da **FATEC Ferraz de Vasconcelos**, aplicando conhecimentos de desenvolvimento web, APIs, banco de dados, engenharia de software e experiência do usuário.

---

## A proposta

O Mercadez parte de uma ideia simples:

> **Facilitar a busca pelo melhor preço enquanto ajuda pequenos comerciantes a terem mais visibilidade.**

Em vez de o consumidor precisar pesquisar individualmente em diferentes estabelecimentos, o Mercadez busca concentrar essas informações em uma única plataforma.

Para o lojista, a solução funciona como uma ferramenta de presença digital e gerenciamento, permitindo cadastrar produtos, atualizar preços, controlar estoque e publicar promoções.

---

## Precinho — o mascote do Mercadez

O **Precinho** é o mascote oficial do Mercadez e representa a identidade da plataforma.

Criado para tornar a experiência mais **amigável, próxima e fácil de compreender**, o Precinho acompanha a identidade visual do projeto e ajuda a humanizar a interação do usuário com a plataforma.

Além de representar visualmente o Mercadez, o mascote pode ser utilizado na comunicação com os usuários, apresentando informações, orientando durante a navegação e destacando funcionalidades da plataforma.

<p align="center">
  <img src="./images/icons/precinho_sem_fundo.png" alt="Precinho — Mascote do Mercadez" width="350">
</p>

<p align="center">
  <strong>Precinho</strong><br>
  Mascote oficial do Mercadez
</p>

---

## Objetivos

### Para consumidores

- Pesquisar produtos;
- Comparar preços;
- Encontrar ofertas;
- Visualizar promoções;
- Criar listas de compras;
- Salvar produtos favoritos;
- Receber notificações de promoções.

### Para comerciantes

- Cadastrar produtos;
- Gerenciar preços;
- Administrar o catálogo;
- Controlar estoque;
- Publicar promoções;
- Acompanhar informações por meio de um dashboard;
- Ampliar a presença digital do estabelecimento.

---

## Funcionalidades

| Funcionalidade | Cliente | Lojista | Administrador |
|---|:---:|:---:|:---:|
| Cadastro e autenticação | Sim | Sim | Sim |
| Pesquisa de produtos | Sim | Sim | Sim |
| Comparação de preços | Sim | Sim | Sim |
| Visualização de ofertas | Sim | Sim | Sim |
| Lista de compras | Sim | - | - |
| Produtos favoritos | Premium | - | - |
| Notificações | Sim | Sim | Sim |
| Cadastro de produtos | - | Sim | Sim |
| Gerenciamento de preços | - | Sim | Sim |
| Gerenciamento de estoque | - | Sim | Sim |
| Dashboard | - | Sim | Sim |
| Publicação de promoções | - | Sim | Sim |
| Controle de usuários | - | - | Sim |
| Controle de acessos | - | - | Sim |

---

## Perfis de usuário

### Cliente

O cliente utiliza o Mercadez para pesquisar produtos, encontrar ofertas e comparar preços entre estabelecimentos.

**Principais ações:**

- Pesquisar produtos;
- Comparar preços;
- Visualizar ofertas;
- Criar listas de compras;
- Favoritar produtos;
- Receber notificações.

### Lojista

O lojista utiliza a plataforma para administrar os produtos e informações do seu estabelecimento.

**Principais ações:**

- Cadastrar produtos;
- Atualizar preços;
- Gerenciar estoque;
- Criar promoções;
- Administrar catálogo;
- Acompanhar informações pelo dashboard.

### Administrador

O administrador é responsável pela supervisão geral da plataforma.

**Principais ações:**

- Gerenciar usuários;
- Controlar permissões;
- Supervisionar estabelecimentos;
- Administrar informações;
- Auxiliar na segurança e integridade do sistema.

---

## Arquitetura da aplicação

O Mercadez utiliza uma arquitetura separando o frontend, backend e banco de dados.

```text
                         MERCADEZ
                            |
             +--------------+--------------+
             |                             |
             v                             v
        FRONTEND                        BACKEND
          React                     Python + FastAPI
             |                             |
             |          HTTP / JSON        |
             +-----------------------------+
                            |
                            v
                       PostgreSQL
