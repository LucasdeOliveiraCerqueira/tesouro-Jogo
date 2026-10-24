# 💎 Caça ao Tesouro

Projeto experimental desenvolvido com **HTML, CSS e JavaScript**, com o objetivo de estudar o funcionamento de um **Progressive Web App (PWA)** e aprender a publicar aplicações web utilizando a **Vercel**.

## 🎯 Objetivo

O jogo não tem como objetivo ser um produto final. Ele serve como um projeto prático para aprender conceitos de desenvolvimento web, instalação de aplicações e hospedagem.

Os principais objetivos são:

- Praticar HTML, CSS e JavaScript.
- Entender como funciona um PWA.
- Configurar um `manifest.json`.
- Implementar um Service Worker.
- Experimentar o funcionamento offline de uma aplicação web.
- Aprender a publicar projetos na Vercel.
- Conhecer o processo de deploy e atualização de aplicações.

## 🎮 Sobre o jogo

Caça ao Tesouro é um jogo simples no qual o jogador controla um personagem, coleta moedas e desvia de inimigos para acumular pontos.

**Funcionalidades:**

- Movimentação por teclado.
- Controles adaptados para dispositivos móveis.
- Sistema de pontuação e vidas.
- Inimigos com movimentação automática.
- Aumento progressivo da dificuldade.
- Interface adaptável a diferentes tamanhos de tela.

## 🛠️ Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| HTML5 | Estrutura da página |
| CSS3 | Estilização e responsividade |
| JavaScript | Lógica e mecânicas do jogo |
| Canvas API | Renderização dos elementos do jogo |
| Web App Manifest | Configuração do aplicativo instalável |
| Service Worker | Cache e suporte ao funcionamento offline |
| Vercel | Hospedagem e publicação do projeto |

## 📁 Estrutura do projeto

```text
caca-ao-tesouro/
├── index.html
├── style.css
├── script.js
├── manifest.json
├── service-worker.js
├── icon.svg
└── README.md
```

## 🚀 Executando localmente

1. Clone o repositório ou baixe os arquivos.
2. Abra a pasta no VS Code.
3. Inicie o projeto utilizando a extensão Live Server.
4. Acesse o endereço local fornecido pela extensão.
5. Abra o console do navegador para verificar o registro do Service Worker.

> O PWA deve ser testado em `localhost` ou em um endereço HTTPS. Abrir o HTML diretamente pelo sistema de arquivos não permite testar todos os recursos do PWA.

## ☁️ Publicação na Vercel

A Vercel será utilizada para praticar o processo de publicação de um projeto web estático.

Etapas previstas:

1. Versionar o projeto com Git.
2. Enviar os arquivos para um repositório no GitHub.
3. Importar o repositório na Vercel.
4. Configurar o projeto como uma aplicação estática, sem necessidade de build.
5. Publicar e acessar a aplicação pelo endereço HTTPS gerado.
6. Testar a instalação do PWA e seu funcionamento offline.
7. Realizar alterações e acompanhar novos deploys.

## 📱 Testes de PWA

Durante o desenvolvimento, serão verificados:

- Carregamento do Web App Manifest.
- Registro do Service Worker.
- Disponibilidade dos arquivos essenciais em cache.
- Abertura do jogo após o primeiro carregamento, mesmo sem internet.
- Possibilidade de instalação em navegadores compatíveis.
- Atualização do cache após novas versões.

## 📚 Finalidade educacional

Este projeto foi criado exclusivamente para fins de estudo e experimentação. O foco está no aprendizado de tecnologias web, na compreensão dos recursos de PWA e na prática de hospedagem e deploy com a Vercel.

## 📄 Licença

Projeto experimental para fins educacionais. 
