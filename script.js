
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const elementoPontos = document.getElementById("pontos");
const elementoVidas = document.getElementById("vidas");
const telaInicial = document.getElementById("telaInicial");
const tituloTela = document.getElementById("tituloTela");
const mensagemTela = document.getElementById("mensagemTela");
const botaoJogar = document.getElementById("botaoJogar");

const LARGURA = canvas.width;
const ALTURA = canvas.height;

const teclas = {};

let jogador;
let moedas = [];
let inimigos = [];
let particulas = [];

let pontos = 0;
let vidas = 3;
let jogando = false;
let invulneravel = 0;
let ultimoTempo = 0;
let tempoDecorrido = 0;

function criarJogador() {
    jogador = {
        x: LARGURA / 2,
        y: ALTURA / 2,
        tamanho: 20,
        velocidade: 230
    };
}

function distancia(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function posicaoLivre(x, y, distanciaMinima = 60) {
    if (
        Math.hypot(x - jogador.x, y - jogador.y) <
        distanciaMinima
    ) {
        return false;
    }

    for (const moeda of moedas) {
        if (Math.hypot(x - moeda.x, y - moeda.y) < 30) {
            return false;
        }
    }

    for (const inimigo of inimigos) {
        if (Math.hypot(x - inimigo.x, y - inimigo.y) < 35) {
            return false;
        }
    }

    return true;
}

function criarMoeda() {
    let x;
    let y;
    let tentativas = 0;

    do {
        x = 25 + Math.random() * (LARGURA - 50);
        y = 25 + Math.random() * (ALTURA - 50);
        tentativas++;
    } while (
        !posicaoLivre(x, y) &&
        tentativas < 100
    );

    moedas.push({
        x,
        y,
        raio: 9,
        brilho: Math.random() * Math.PI * 2
    });
}

function criarInimigo() {
    let x;
    let y;
    let tentativas = 0;

    do {
        x = 25 + Math.random() * (LARGURA - 50);
        y = 25 + Math.random() * (ALTURA - 50);
        tentativas++;
    } while (
        Math.hypot(x - jogador.x, y - jogador.y) < 150 &&
        tentativas < 100
    );

    const angulo = Math.random() * Math.PI * 2;
    const velocidade = 65 + Math.random() * 35;

    inimigos.push({
        x,
        y,
        raio: 13,
        vx: Math.cos(angulo) * velocidade,
        vy: Math.sin(angulo) * velocidade
    });
}

function atualizarPlacar() {
    elementoPontos.textContent = pontos;

    elementoVidas.textContent =
        "❤️".repeat(vidas) +
        "🖤".repeat(3 - vidas);
}

function iniciarJogo() {
    pontos = 0;
    vidas = 3;
    invulneravel = 0;
    tempoDecorrido = 0;

    moedas = [];
    inimigos = [];
    particulas = [];

    criarJogador();

    for (let i = 0; i < 5; i++) {
        criarMoeda();
    }

    criarInimigo();
    criarInimigo();

    atualizarPlacar();

    jogando = true;
    ultimoTempo = performance.now();

    telaInicial.classList.add("escondido");

    requestAnimationFrame(animar);
}

function finalizarJogo() {
    jogando = false;

    tituloTela.textContent = "Fim de jogo!";

    mensagemTela.textContent =
        `Você fez ${pontos} pontos. ` +
        "Tente novamente e supere sua pontuação!";

    botaoJogar.textContent = "JOGAR NOVAMENTE";

    telaInicial.classList.remove("escondido");
}

function criarParticulas(x, y, cor) {
    for (let i = 0; i < 8; i++) {
        const angulo = Math.random() * Math.PI * 2;
        const velocidade = 40 + Math.random() * 120;

        particulas.push({
            x,
            y,
            vx: Math.cos(angulo) * velocidade,
            vy: Math.sin(angulo) * velocidade,
            vida: 0.5,
            cor
        });
    }
}

function atualizar(dt) {
    tempoDecorrido += dt;

    invulneravel = Math.max(0, invulneravel - dt);

    let dx = 0;
    let dy = 0;

    if (teclas.ArrowUp || teclas.w || teclas.W) {
        dy--;
    }

    if (teclas.ArrowDown || teclas.s || teclas.S) {
        dy++;
    }

    if (teclas.ArrowLeft || teclas.a || teclas.A) {
        dx--;
    }

    if (teclas.ArrowRight || teclas.d || teclas.D) {
        dx++;
    }

    const comprimento = Math.hypot(dx, dy);

    if (comprimento > 0) {
        dx /= comprimento;
        dy /= comprimento;
    }

    jogador.x += dx * jogador.velocidade * dt;
    jogador.y += dy * jogador.velocidade * dt;

    jogador.x = Math.max(
        jogador.tamanho,
        Math.min(LARGURA - jogador.tamanho, jogador.x)
    );

    jogador.y = Math.max(
        jogador.tamanho,
        Math.min(ALTURA - jogador.tamanho, jogador.y)
    );

    // Atualiza os inimigos
    for (const inimigo of inimigos) {
        inimigo.x += inimigo.vx * dt;
        inimigo.y += inimigo.vy * dt;

        if (
            inimigo.x < inimigo.raio ||
            inimigo.x > LARGURA - inimigo.raio
        ) {
            inimigo.vx *= -1;
        }

        if (
            inimigo.y < inimigo.raio ||
            inimigo.y > ALTURA - inimigo.raio
        ) {
            inimigo.vy *= -1;
        }

        // Detecta colisão com o jogador
        if (
            invulneravel <= 0 &&
            distancia(jogador, inimigo) <
                jogador.tamanho + inimigo.raio
        ) {
            vidas--;
            invulneravel = 1.5;

            criarParticulas(
                jogador.x,
                jogador.y,
                "#ff5d73"
            );

            atualizarPlacar();

            const angulo = Math.atan2(
                inimigo.y - jogador.y,
                inimigo.x - jogador.x
            );

            inimigo.x += Math.cos(angulo) * 35;
            inimigo.y += Math.sin(angulo) * 35;

            if (vidas <= 0) {
                finalizarJogo();
                return;
            }
        }
    }

    // Coleta moedas
    for (let i = moedas.length - 1; i >= 0; i--) {
        const moeda = moedas[i];

        if (
            distancia(jogador, moeda) <
            jogador.tamanho + moeda.raio
        ) {
            pontos += 10;

            criarParticulas(
                moeda.x,
                moeda.y,
                "#ffd166"
            );

            moedas.splice(i, 1);

            criarMoeda();
            atualizarPlacar();
        }
    }

    // Aumenta a dificuldade com o tempo
    if (tempoDecorrido >= 15) {
        tempoDecorrido = 0;

        if (inimigos.length < 8) {
            criarInimigo();
        }

        for (const inimigo of inimigos) {
            inimigo.vx *= 1.08;
            inimigo.vy *= 1.08;
        }
    }

    // Atualiza as partículas
    for (let i = particulas.length - 1; i >= 0; i--) {
        const p = particulas[i];

        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vida -= dt;

        if (p.vida <= 0) {
            particulas.splice(i, 1);
        }
    }

    // Anima as moedas
    for (const moeda of moedas) {
        moeda.brilho += dt * 4;
    }
}

function desenharFundo() {
    ctx.fillStyle = "#10192d";
    ctx.fillRect(0, 0, LARGURA, ALTURA);

    ctx.strokeStyle = "#1b2942";
    ctx.lineWidth = 1;

    for (let x = 0; x < LARGURA; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ALTURA);
        ctx.stroke();
    }

    for (let y = 0; y < ALTURA; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(LARGURA, y);
        ctx.stroke();
    }
}

function desenharJogador() {
    if (
        invulneravel > 0 &&
        Math.floor(invulneravel * 12) % 2 === 0
    ) {
        return;
    }

    ctx.save();

    ctx.shadowColor = "#72f1b8";
    ctx.shadowBlur = 18;

    ctx.fillStyle = "#72f1b8";

    ctx.beginPath();

    ctx.arc(
        jogador.x,
        jogador.y,
        jogador.tamanho,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle = "#102b2a";

    ctx.beginPath();

    ctx.arc(
        jogador.x - 6,
        jogador.y - 3,
        3,
        0,
        Math.PI * 2
    );

    ctx.arc(
        jogador.x + 6,
        jogador.y - 3,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.strokeStyle = "#102b2a";
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.arc(
        jogador.x,
        jogador.y + 2,
        7,
        0.2,
        Math.PI - 0.2
    );

    ctx.stroke();

    ctx.restore();
}

function desenharMoedas() {
    for (const moeda of moedas) {
        const tamanho =
            moeda.raio + Math.sin(moeda.brilho) * 1.5;

        ctx.save();

        ctx.shadowColor = "#ffd166";
        ctx.shadowBlur = 15;
        ctx.fillStyle = "#ffd166";

        ctx.beginPath();

        ctx.arc(
            moeda.x,
            moeda.y,
            tamanho,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#a66b12";
        ctx.font = "bold 13px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText("$", moeda.x, moeda.y + 1);

        ctx.restore();
    }
}

function desenharInimigos() {
    for (const inimigo of inimigos) {
        ctx.save();

        ctx.shadowColor = "#ff5d73";
        ctx.shadowBlur = 15;
        ctx.fillStyle = "#ff5d73";

        ctx.beginPath();

        ctx.arc(
            inimigo.x,
            inimigo.y,
            inimigo.raio,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#521b35";

        ctx.beginPath();

        ctx.arc(
            inimigo.x - 4,
            inimigo.y - 3,
            2,
            0,
            Math.PI * 2
        );

        ctx.arc(
            inimigo.x + 4,
            inimigo.y - 3,
            2,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }
}

function desenharParticulas() {
    for (const p of particulas) {
        ctx.globalAlpha = Math.max(0, p.vida / 0.5);
        ctx.fillStyle = p.cor;

        ctx.beginPath();

        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);

        ctx.fill();
    }

    ctx.globalAlpha = 1;
}

function desenhar() {
    desenharFundo();
    desenharMoedas();
    desenharInimigos();
    desenharParticulas();

    if (jogador) {
        desenharJogador();
    }
}

function animar(tempoAtual) {
    if (!jogando) {
        return;
    }

    const dt = Math.min(
        (tempoAtual - ultimoTempo) / 1000,
        0.05
    );

    ultimoTempo = tempoAtual;

    atualizar(dt);
    desenhar();

    if (jogando) {
        requestAnimationFrame(animar);
    }
}

// Controles do teclado
document.addEventListener("keydown", (evento) => {
    teclas[evento.key] = true;

    if (
        [
            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            " "
        ].includes(evento.key)
    ) {
        evento.preventDefault();
    }

    if (
        evento.key.toLowerCase() === "r" &&
        !jogando
    ) {
        iniciarJogo();
    }
});

document.addEventListener("keyup", (evento) => {
    teclas[evento.key] = false;
});

// Evita movimento preso ao trocar de janela
window.addEventListener("blur", () => {
    for (const tecla in teclas) {
        teclas[tecla] = false;
    }
});

// Botão de iniciar e reiniciar
botaoJogar.addEventListener("click", iniciarJogo);

// Controles para celular
document
    .querySelectorAll("[data-direcao]")
    .forEach((botao) => {
        const direcao = botao.dataset.direcao;

        const mapa = {
            cima: "ArrowUp",
            baixo: "ArrowDown",
            esquerda: "ArrowLeft",
            direita: "ArrowRight"
        };

        function pressionar(evento) {
            evento.preventDefault();
            teclas[mapa[direcao]] = true;
        }

        function soltar(evento) {
            evento.preventDefault();
            teclas[mapa[direcao]] = false;
        }

        botao.addEventListener("pointerdown", pressionar);
        botao.addEventListener("pointerup", soltar);
        botao.addEventListener("pointerleave", soltar);
        botao.addEventListener("pointercancel", soltar);
    });

// Desenha a tela antes de começar
criarJogador();
desenhar();

// REGISTRO DO PWA — DEIXAR NO FINAL DO ARQUIVO
if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
        try {
            await navigator.serviceWorker.register(
                "./service-worker.js"
            );

            console.log("PWA ativado com sucesso!");
        } catch (erro) {
            console.error(
                "Erro ao ativar o PWA:",
                erro
            );
        }
    });
}