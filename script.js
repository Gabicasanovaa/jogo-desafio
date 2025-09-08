const perguntas = {
  zoeira: [
    // 👇 50 perguntas zoeiras aqui (use as da resposta anterior)
    "Dance como uma galinha por 20 segundos.",
    "Imite um famoso até alguém adivinhar.",
    // ...
    "Fale tudo como se fosse um vampiro educado."
  ],
  picante: [
    // 👇 50 perguntas picantes aqui (use as da resposta anterior)
    "Diga a coisa mais ousada que já fez em um encontro.",
    "Revele seu crush secreto.",
    // ...
    "Se pudesse trocar de corpo com alguém por um dia, quem seria e por quê?"
  ],
  insano: [
    // 👇 50 perguntas insanas aqui (use as da resposta anterior)
    "Ligue para alguém e cante 'Parabéns'.",
    "Troque de roupa com alguém na roda.",
    // ...
    "Mime uma luta entre dois marshmallows gigantes."
  ]
};

let jogadores = [];
let shots = {};
let jogadorAtual = "";
let tempo = 15;
let timerInterval;

function tocarSom() {
  const audio = document.getElementById("sound-click");
  if (audio) audio.play();
}

function criarCamposJogadores() {
  const qtd = document.getElementById("qtdJogadores").value;
  const campos = document.getElementById("camposJogadores");
  campos.innerHTML = "";
  for (let i = 0; i < qtd; i++) {
    campos.innerHTML += `<input type="text" placeholder="Jogador ${i + 1}" id="jogador${i}"><br>`;
  }
  document.getElementById("inicio").style.display = "none";
  document.getElementById("jogo").style.display = "block";
}
function iniciarJogo() {
  jogadores = [];
  shots = {};
  let i = 0;
  while (document.getElementById(`jogador${i}`)) {
    const nome = document.getElementById(`jogador${i}`).value.trim();
    if (nome) {
      jogadores.push(nome);
      shots[nome] = 0;
    }
    i++;
  }

  if (jogadores.length < 3) {
    alert("Adicione pelo menos 3 jogadores.");
    return;
  }

  document.getElementById("jogo").style.display = "none";
  document.getElementById("rodada").style.display = "block";
  proximaRodada();
}

function escolherPergunta(categoriaSelecionada) {
  let todas = [];
  if (categoriaSelecionada === "todas") {
    Object.values(perguntas).forEach(arr => todas.push(...arr));
  } else {
    todas = perguntas[categoriaSelecionada] || [];
  }
  return todas[Math.floor(Math.random() * todas.length)];
}

function iniciarTimer() {
  tempo = 15;
  document.getElementById("timer").innerText = `⏱️ Tempo restante: ${tempo}s`;
  timerInterval = setInterval(() => {
    tempo--;
    document.getElementById("timer").innerText = `⏱️ Tempo restante: ${tempo}s`;
    if (tempo <= 0) {
      clearInterval(timerInterval);
      alert(`${jogadorAtual} demorou demais e vai beber! 🍺`);
      shots[jogadorAtual]++;
      atualizarRanking();
      proximaRodada();
    }
  }, 1000);
}

function proximaRodada() {
  clearInterval(timerInterval);
  jogadorAtual = jogadores[Math.floor(Math.random() * jogadores.length)];
  const categoria = document.getElementById("categoria").value;
  const desafio = escolherPergunta(categoria);

  document.getElementById("jogadorAtual").innerText = `🎯 ${jogadorAtual}, é sua vez!`;
  document.getElementById("desafioTexto").innerText = desafio;

  iniciarTimer();
  atualizarRanking();
}

function cumprir() {
  tocarSom();
  clearInterval(timerInterval);
  alert(`${jogadorAtual} cumpriu o desafio! ✅`);
  proximaRodada();
}

function beber() {
  tocarSom();
  clearInterval(timerInterval);
  shots[jogadorAtual]++;
  alert(`${jogadorAtual} recusou e tomou um shot! 🍺`);
  proximaRodada();
}

function atualizarRanking() {
  let html = "<h3>Ranking de Shots 🥃</h3><ul>";
  for (let nome in shots) {
    html += `<li>${nome}: ${shots[nome]} shot(s)</li>`;
  }
  html += "</ul>";
  document.getElementById("ranking").innerHTML = html;
}
