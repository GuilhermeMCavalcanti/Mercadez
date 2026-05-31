-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 04/07/2025 às 23:26
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `mercadez`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `mcdz_produtos`
--

CREATE TABLE `mcdz_produtos` (
  `id` int(11) NOT NULL,
  `produto` varchar(100) NOT NULL,
  `tags` varchar(500) NOT NULL,
  `preço` int(100) NOT NULL,
  `quantidade` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `mcdz_produtos`
--

INSERT INTO `mcdz_produtos` (`id`, `produto`, `tags`, `preço`, `quantidade`) VALUES
(1, 'Manteiga', 'processado, laticinio', 10, 50);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `cpf` int(11) NOT NULL,
  `senha` int(255) NOT NULL,
  `perfil` enum('cliente','admin','','') NOT NULL DEFAULT 'cliente',
  `cnpj` int(14) NOT NULL,
  `endereço` varchar(100) NOT NULL,
  `telefone` int(50) NOT NULL,
  `mercado` varchar(100) NOT NULL,
  `categoria` varchar(200) NOT NULL,
  `funcionários` int(50) NOT NULL,
  `pagamento` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `cpf`, `senha`, `perfil`, `cnpj`, `endereço`, `telefone`, `mercado`, `categoria`, `funcionários`, `pagamento`) VALUES
(5, 'carlos', 'carlos@email.com', 222, 123, 'cliente', 0, '', 0, '', '', 0, ''),
(19, 'river', 'indesert@email.com', 0, 123, 'admin', 333, 'rua', 999, 'mercadinho', 'bairro', 12, 'cartão, dinheiro'),
(20, 'teste', 'teste', 0, 123, 'admin', 123, 'teste', 123, 'teste', 'teste', 123, 'teste');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `mcdz_produtos`
--
ALTER TABLE `mcdz_produtos`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `mcdz_produtos`
--
ALTER TABLE `mcdz_produtos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
