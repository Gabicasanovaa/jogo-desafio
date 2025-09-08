const perguntas = {
  zoeira: [
    "Dance como uma galinha por 20 segundos.",
    "Imite um famoso até alguém adivinhar.",
    "Fale tudo como se fosse um vampiro educado.",
    // Perguntas extras zoeira:
    "Faça uma dancinha ridícula por 15 segundos.",
    "Finja que está preso numa gaiola e peça ajuda.",
    "Conte uma piada sem graça e espere a reação.",
    "Fale com um sotaque engraçado até a próxima rodada.",
    "Imite um animal que ninguém adivinhe.",
    "Faça cara de bravo por 10 segundos.",
    "Cante o refrão de uma música infantil.",
    "Fale o alfabeto de trás pra frente.",
    "Faça um som de robô até a sua próxima vez.",
    "Conte uma história engraçada que aconteceu com você."
  ],
  picante: [
    "Diga a coisa mais ousada que já fez em um encontro.",
    "Revele seu crush secreto.",
    "Se pudesse trocar de corpo com alguém por um dia, quem seria e por quê?",
    // Perguntas extras picante:
    "Conte uma situação embaraçosa que já viveu em um encontro.",
    "Faça um elogio ousado para alguém na sala.",
    "Dê um beijo imaginário na pessoa que estiver à sua esquerda.",
    "Conte qual foi sua maior “saída” de uma paquera.",
    "Diga uma coisa que ninguém aqui sabe sobre você.",
    "Finja que está flertando com alguém por 20 segundos.",
    "Descreva seu encontro perfeito em detalhes.",
    "Fale qual foi sua maior conquista romântica.",
    "Conte uma fantasia engraçada.",
    "Imite um personagem sexy de filme ou série."
  ],
  insano: [
    "Ligue para alguém e cante 'Parabéns'.",
    "Troque de roupa com alguém na roda.",
    "Mime uma luta entre dois marshmallows gigantes.",
    // Perguntas extras insano:
    "Faça uma coreografia maluca no meio da sala.",
    "Finja que está dirigindo um carro descontrolado.",
    "Imite um super-herói em apuros.",
    "Faça uma mímica de um animal estranho.",
    "Cante uma música famosa com a voz desafinada.",
    "Conte uma mentira absurda e tente convencer todo mundo.",
    "Faça um “duelo” de caretas com alguém.",
    "Finja que está em um reality show e justifique sua eliminação.",
    "Faça um monólogo dramático sobre uma fruta.",
    "Dance como se tivesse apanhado de um fantasma."
  ]
};

// NOVOS CONTROLES
let jogadores = [];
let shots = {};
let desafiosCumpridos = {};
let jogadorAtual = "";
let rodadaAtual = 0;
const rodadaBonusACada = 5;
let desafiosUsados = {
  zoeira: [],
  picante: [],
  insano: [],
  todas: []
};

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
  desafiosCumpridos = {};
  rodadaAtual = 0;
  desafiosUsados = { zoeira: [], picante: [], insano: [], todas: [] };

  let i = 0;
  while (document.getElementById(`jogador${i}`)) {
    const nome = document.getElementById(`jogador${i}`).value.trim();
    if (nome) {
      jogadores.push(nome);
      shots[nome] = 0;
      desafiosCumpridos[nome] = 0;
    }
    i++;
  }

  if (jogadores.length < 1) {
    alert("Adicione pelo menos 1 jogador.");
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

  // Verificar se todas as perguntas já foram usadas
  const usadas = desafiosUsados[categoriaSelecionada] || [];
  const restantes = todas.filter(p => !usadas.includes(p));

  if (restantes.length === 0) {
    // Resetar desafios se todos foram usados
    desafiosUsados[categoriaSelecionada] = [];
    return escolherPergunta(categoriaSelecionada);
  }

  const desafio = restantes[Math.floor(Math.random() * restantes.length)];
  desafiosUsados[categoriaSelecionada].push(desafio);

  return desafio;
}

function iniciarTimer() {
  // Timer removido — sem limite de tempo
  document.getElementById("timer").innerText = "";
}

function proximaRodada() {
  // Sem clearInterval pois timer foi removido
  rodadaAtual++;

  let novoJogador;
  do {
    novoJogador = jogadores[Math.floor(Math.random() * jogadores.length)];
  } while (novoJogador === jogadorAtual && jogadores.length > 1);
  jogadorAtual = novoJogador;

  let categoria = document.getElementById("categoria").value;

  // RODADA BÔNUS
  let desafio;
  if (rodadaAtual % rodadaBonusACada === 0) {
    desafio = "🎁 RODADA BÔNUS: TODOS devem imitar um pato ou beber!";
  } else {
    desafio = escolherPergunta(categoria);
  }

  document.getElementById("jogadorAtual").innerText = `🎯 ${jogadorAtual}, é sua vez!`;
  document.getElementById("desafioTexto").innerText = desafio;

  iniciarTimer();
  atualizarRanking();
}

function cumprir() {
  tocarSom();
  alert(`${jogadorAtual} cumpriu o desafio! ✅`);
  desafiosCumpridos[jogadorAtual]++;
  proximaRodada();
}

function beber() {
  tocarSom();
  shots[jogadorAtual]++;
  alert(`${jogadorAtual} recusou e tomou um shot! 🍺`);
  proximaRodada();
}

function atualizarRanking() {
  let html = "<h3>Ranking 🏆</h3>";

  html += "<strong>✅ Corajosos:</strong><ul>";
  for (let nome in desafiosCumpridos) {
    html += `<li>${nome}: ${desafiosCumpridos[nome]} desafio(s) cumprido(s)</li>`;
  }
  html += "</ul>";

  html += "<strong>🍺 Bêbados:</strong><ul>";
  for (let nome in shots) {
    html += `<li>${nome}: ${shots[nome]} shot(s)</li>`;
  }
  html += "</ul>";

  // HALL DA VERGONHA
  let maiorBebado = Object.keys(shots).reduce((a, b) => shots[a] > shots[b] ? a : b);
  html += `<p>😵 <strong>Hall da Vergonha:</strong> ${maiorBebado} bebeu mais! (${shots[maiorBebado]} shots)</p>`;

  // ESTATÍSTICAS GERAIS
  const totalDesafios = Object.values(desafiosCumpridos).reduce((a, b) => a + b, 0);
  const totalShots = Object.values(shots).reduce((a, b) => a + b, 0);
  html += `<p>📊 <strong>Rodadas jogadas:</strong> ${rodadaAtual}</p>`;
  html += `<p>📈 <strong>Total de desafios cumpridos:</strong> ${totalDesafios}</p>`;
  html += `<p>🍻 <strong>Total de shots tomados:</strong> ${totalShots}</p>`;

  document.getElementById("ranking").innerHTML = html;
}
