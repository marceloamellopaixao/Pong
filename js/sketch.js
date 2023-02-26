// Posição da Bolinha e Diâmetro
let xBall = 300;
let yBall = 200;
let dBall = 13;
let dRBall = dBall / 2;

// Velocidade da Bolinha nos Eixos X e Y
let vXBall = 7;
let vYBall = 7;

// Váriaveis de Colisão na Raquete
let collision = false;

// Váriaveis da Raquete do Jogador
let xRacket = 5;
let yRacket = 180;
let wRacket = 10;
let hRacket = 50;

// Váriaveis da Raquete do Oponente
let xRacketOp = 585;
let yRacketOp = 180;
let vYRacketOp;

// Váriavel Oponente BOT com chance de erro
let errorChance = 0;

// Váriaveis Placar do Jogo
let pointsPlayer = 0;
let pointsOp = 0;

// Sons Ambiente
let backSound;
let racketSound;
let pointSound;

// Pré-carrega o jogo antes de iniciar
function preload() {
  backSound = loadSound("./sounds/trilha.mp3");
  racketSound = loadSound("./sounds/raquetada.mp3");
  pointSound = loadSound("./sounds/ponto.mp3");
}

// Cria o tamanho da tela do jogo
function setup() {
  createCanvas(600, 400);
  backSound.loop();
}

// Cria e realiza as funções seguintes
function draw() {
  // Criação da tela e bolinha
  background(0); // Plano de fundo
  showBall(); // Mostra a Bolinha
  moveBall(); // Movimenta a Bolinha
  vrfCollision(); // Verifica a colisão da bolinha nas paredes do jogo.

  // Jogador
  racketShow(xRacket, yRacket); // Mostra a Raquete do Jogador
  movRacketPlayer();
  //vrfCollisionRacket(xRacket, yRacket); // Um dos meios de verificação de colisão na raquete
  vrfCollisionLibraryRacket(xRacket, yRacket);

  // Oponente
  racketShow(xRacketOp, yRacketOp); // Mostra a Raquete do Oponente
  //movRacketOp(); // Movimentação da Raquete do BOT
  movRacketOpPc(); // Movimentação da Raquete do Oponente
  //vrfCollisionRacket(xRacketOp, yRacketOp);
  vrfCollisionLibraryRacket(xRacketOp, yRacketOp); // Verifica a colisão entre a bolinha e a raquete do oponente

  // Placar
  insertPlacar(); // Cria um placar
  pointerInsert(); // Marca os pontos

  // Aumento de dificuldade
  // DESENVOLVENDO.

  // Resolução de Bugs
  limitRacket();
  ballCantBeStuck();
}

// Mostra a Bolinha
function showBall() {
  circle(xBall, yBall, dBall);
}

// Movimentação da Bolinha
function moveBall() {
  xBall += vXBall;
  yBall += vYBall;
}

// Verifica a colisão nas paredes do jogo.
function vrfCollision() {
  if (xBall + dRBall > width || xBall - dRBall < 0) {
    vXBall *= -1;
  } else if (yBall + dRBall > height || yBall - dRBall < 0) {
    vYBall *= -1;
  } else {
    return false;
  }
}

// Mostra as Raquetes dos Jogadores
function racketShow(x, y) {
  rect(x, y, wRacket, hRacket);
}

// Movimentação da Raquete do Jogador
function movRacketPlayer() {
  if (keyIsDown(87)) {
    yRacket -= 9;
  } else if (keyIsDown(83)) {
    yRacket += 9;
  }
}

// Um meio de verificação da colisão entre a bolinha e a raquete.

function vrfCollisionRacket(x, y) {
  if (
    xBall - dRBall < x + wRacket &&
    yBall - dRBall < y + hRacket &&
    yBall - dRBall > y
  ) {
    vXBall *= -1;
    racketSound.play();
    resume();
  } else {
    return false;
  }
}

// Verifica a colisão entre a bolinha e a Raquete por meio de biblioteca do GitHub

function vrfCollisionLibraryRacket(x, y) {
  collision = collideRectCircle(x, y, wRacket, hRacket, xBall, yBall, dRBall);
  if (collision) {
    vXBall *= -1;
    racketSound.play();
  } else {
    return false;
  }
}

// Movimenta a raquete do oponente (BOT)
function movRacketOp() {
  vYRacketOp = yBall - yRacketOp - wRacket / 2 - 30;
  yRacketOp += vYRacketOp + errorChance;
  calcErrorChance();
}

// Cálculo da Chance de Erro do Bot acima
function calcErrorChance() {
  if (pointsOp >= pointsPlayer) {
    errorChance += 1;
    if (errorChance >= 39) {
      errorChance = 40;
    }
  } else {
    errorChance -= 1;
    if (errorChance <= 35) {
      errorChance = 35;
    }
  }
}

// Movimentação da Raquete do Jogador Oponente
function movRacketOpPc() {
  if (keyIsDown(UP_ARROW)) {
    yRacketOp -= 9;
  } else if (keyIsDown(DOWN_ARROW)) {
    yRacketOp += 9;
  }
}

// Cria o placar na tela
function insertPlacar() {
  // Configurações de exibição do texto
  let backgroundOrange = color(255, 140, 0);
  let backgroundBorder = color(255, 255, 255);
  stroke(backgroundBorder);

  textFont("Poppins");
  textAlign(CENTER);
  textSize(20);

  // Pontos do Jogador
  // Fundo do Texto
  fill(backgroundOrange); // Fundo laranja
  rect(150, 13, 40, 20);
  // Texto
  fill(255, 255, 255); // Texto branco
  text(pointsPlayer, 170, 30);

  // Pontos do Oponente
  // Fundo do Texto
  fill(backgroundOrange); // Fundo laranja
  rect(450, 13, 40, 20);
  // Texto
  fill(255, 255, 255); // Texto branco
  text(pointsOp, 470, 30);
}

function pointerInsert() {
  if (xBall > 595) {
    pointsPlayer += 1;
    pointSound.play();
  } else if (xBall < 5) {
    pointsOp += 1;
    pointSound.play();
  } else {
    return false;
  }
}

// Resolução de Bugs

// As raquetes não podem passar as bordas
function limitRacket() {
  if (yRacket < 0) {
    yRacket = 0;
  } else if (yRacket > 400 - hRacket) {
    yRacket = 400 - hRacket;
  } else if (yRacketOp < 0) {
    yRacketOp = 0;
  } else if (yRacketOp > 400 - hRacket) {
    yRacketOp = 400 - hRacket;
  }
}

// Bolinha presa nos cantos laterais
function ballCantBeStuck() {
  if (xBall - dRBall < 0 || xBall - dRBall > 600) {
    xBall = 23;
    yball = 1; // EM MANUTENÇÃO
  } else {
    return true;
    console.log("teste");
  }
}
