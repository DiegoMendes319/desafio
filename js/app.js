const gridEl       = document.getElementById('grid');
const secEl        = document.getElementById('sec');
const msEl         = document.getElementById('ms');
const scoreEl      = document.getElementById('score');
const startBtn     = document.getElementById('start');
const restartBtn   = document.getElementById('restart');
const historyList  = document.getElementById('historyList');

let numbers       = [];
let nextNumber    = 1;
let score         = 0;
let timerInterval;
let startTime     = null;
let history       = [];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    secEl.textContent = String(Math.floor(elapsed / 1000)).padStart(2, '0');
    msEl.textContent  = String(elapsed % 1000).padStart(3, '0');
  }, 10);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateHistory(timeStr) {
  history.push(timeStr);
  const li = document.createElement('li');
  li.textContent = timeStr + ' segundos';
  historyList.prepend(li);
}

function showConfetti() {
  confetti({ particleCount: 150, spread: 60, origin: { y: 0.6 } });
}

function showMessage(text) {
  const msg = document.createElement('div');
  msg.className = 'message';
  msg.textContent = text;
  document.body.appendChild(msg);
  requestAnimationFrame(() => msg.classList.add('visible'));
  setTimeout(() => {
    msg.classList.remove('visible');
    setTimeout(() => document.body.removeChild(msg), 500);
  }, 2000);
}

function createGrid() {
  gridEl.innerHTML = '';
  numbers = shuffle(Array.from({ length: 36 }, (_, i) => i + 1));
  numbers.forEach(num => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.textContent = num;
    cell.addEventListener('mousedown', () => {
      if (num === nextNumber) cell.style.backgroundColor = '#4caf50';
    });
    cell.addEventListener('mouseup', () => {
      if (num === nextNumber) {
        cell.style.backgroundColor = '';
        score++; scoreEl.textContent = score;
        nextNumber++;
        if (nextNumber === 2) startTimer();
        if (score === 36) {
          stopTimer();
          const timeStr = `${secEl.textContent}.${msEl.textContent}`;
          updateHistory(timeStr);
          showConfetti();
          showMessage('Parabéns! Você concluiu em ' + timeStr + 's');
        }
      }
    });
    gridEl.appendChild(cell);
  });
}

function startGame() {
  nextNumber = 1;
  score = 0;
  scoreEl.textContent = '0';
  secEl.textContent = '00';
  msEl.textContent = '000';
  createGrid();
  gridEl.classList.remove('disabled');
}

startBtn.addEventListener('click', () => startGame());

restartBtn.addEventListener('click', () => {
  stopTimer();
  const timeStr = secEl.textContent + '.' + msEl.textContent;
  if (score > 0) updateHistory(timeStr);
  showConfetti();
  showMessage('Boa tentativa! Tente novamente');
  startGame();
});

// Inicial: grade desabilitada até clicar em Iniciar
