const playBoard = document.querySelector('.play-board');
const score = document.querySelector('.score');
const highScore = document.querySelector('.hight-score');
const controls = document.querySelectorAll('.arrow');

const food = {
  x: 13,
  y: 10,
};
const snake = {
  x: 5,
  y: 10,
  body: [],
};
const velocity = {
  x: 0,
  y: 0,
};

const set = {
  isGameOver: false,
  keepGame: null,
  score: 0,
  highScore: localStorage.getItem('highScore') || 0,
};
score.innerHTML = `Score: ${set.score}`;
highScore.innerHTML = `High Score: ${set.highScore}`;

const changeFoodPosition = () => {
  food.x = Math.floor(Math.random() * 30) + 1;
  food.y = Math.floor(Math.random() * 30) + 1;
};

const gameOver = () => {
  alert('Game Over');
  clearInterval(set.keepGame);
  location.reload();
};

const initGame = () => {
  if (set.isGameOver) return gameOver();
  const html = [];
  html.push(`<div class="food" style="grid-area:${food.y} / ${food.x}"></div>`);

  if (snake.x === food.x && snake.y === food.y) {
    changeFoodPosition();
    snake.body.push([food.x, food.y]);
    set.score++;

    set.highScore = set.score >= set.highScore ? set.score : set.highScore;
    localStorage.setItem('highScore', set.highScore);
    score.innerHTML = `Score: ${set.score}`;
    highScore.innerHTML = `High Score: ${set.highScore}`;
  }

  for (let i = snake.body.length - 1; i > 0; i--) {
    snake.body[i] = snake.body[i - 1];
  }

  snake.body[0] = [snake.x, snake.y];
  snake.x += velocity.x;
  snake.y += velocity.y;

  if (snake.x <= 0 || snake.x > 30 || snake.y <= 0 || snake.y > 30) {
    set.isGameOver = true;
  }

  for (let i = 0; i < snake.body.length; i++) {
    html.push(
      `<div class="snake" style="grid-area:${snake.body[i][1]} / ${snake.body[i][0]}"></div>`
    );
    if (
      i !== 0 &&
      snake.body[0][1] === snake.body[i][1] &&
      snake.body[0][0] === snake.body[i][0]
    ) {
      set.isGameOver = true;
    }
  }

  playBoard.innerHTML = html.join('');
};

controls.forEach((arrow) => {
  arrow.addEventListener('click', (e) =>
    changeDirection({ key: e.target.dataset.key })
  );
});

const changeDirection = (e) => {
  const { key } = e;
  console.log(key);
  if (key === 'ArrowUp' && velocity.y !== 1) {
    velocity.x = 0;
    velocity.y = -1;
  } else if (key === 'ArrowDown' && velocity.y !== -1) {
    velocity.x = 0;
    velocity.y = 1;
  } else if (key === 'ArrowLeft' && velocity.x !== 1) {
    velocity.x = -1;
    velocity.y = 0;
  } else if (key === 'ArrowRight' && velocity.x !== -1) {
    velocity.x = 1;
    velocity.y = 0;
  }
  initGame();
};

changeFoodPosition();
set.keepGame = setInterval(initGame, 125);
document.addEventListener('keydown', changeDirection);
