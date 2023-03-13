const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");

let keys = {
  ArrowUp: false,
  ArrowRight: false,
  ArrowLeft: false,
  ArrowDown: false,
};

let player = { speed: 5, score: 0 };

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

startScreen.addEventListener("click", start);

function keyDown(event) {
  // event.preventDefault();
  //   console.log(event.key);
  if (event.key == "ArrowDown" || event.key == "ArrowUp" || event.key == "ArrowRight" || event.key == "ArrowLeft") keys[event.key] = true;
  //   console.log(keys);
}
function keyUp(event) {
  // event.preventDefault();
  //   console.log(event.key);
  if (event.key == "ArrowDown" || event.key == "ArrowUp" || event.key == "ArrowRight" || event.key == "ArrowLeft") keys[event.key] = false;
  //   console.log(keys);
}

function endGame() {
  player.start = false;
  score.classList.remove("animate__zoomIn");

  // startScreen.style.opacity = 1;
  startScreen.classList.remove("hide");
  startScreen.innerHTML = `Game Over <br> Your Score : ${player.score + 1} <br> Click here to restart`;
  startScreen.classList.add("animate__flash");
}

function isCollide(a, b) {
  aRect = a.getBoundingClientRect();
  bRect = b.getBoundingClientRect();

  let { bottom: a_bottom, top: a_top, left: a_left, right: a_right } = aRect;
  let { bottom: b_bottom, top: b_top, left: b_left, right: b_right } = bRect;

  return !(a_bottom <= b_top || a_right <= b_left || a_top >= b_bottom || a_left >= b_right);
}

function moveLines() {
  let lines = document.querySelectorAll(".lines");
  lines.forEach((item) => {
    if (item.y >= 700) {
      item.y -= 750;
    }
    item.y += player.speed;
    item.style.top = `${item.y}px`;
  });
}

function moveEnemy(car) {
  let enemies = document.querySelectorAll(".enemy");
  enemies.forEach((item) => {
    if (isCollide(car, item)) {
      console.log("Boom !!");
      endGame();
    }
    if (item.y >= 750) {
      item.y = -300;
      item.style.left = `${Math.round(Math.random() * 350)}px`;
    }

    item.y += player.speed;
    item.style.top = `${item.y}px`;
  });
}

function gamePlay() {
  //   console.log("I am clicked");
  let car = document.querySelector(".car");
  let road = gameArea.getBoundingClientRect();
  // console.log(road);
  if (player.start) {
    moveLines();
    moveEnemy(car);
    if (keys.ArrowUp && player.y > road.top + 150) player.y -= player.speed + 3;
    if (keys.ArrowDown && player.y < road.height - 90) player.y += player.speed + 3;
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed + 3;
    if (keys.ArrowRight && player.x < road.width - 50) player.x += player.speed + 3;

    car.style.top = `${player.y}px`;
    car.style.left = `${player.x}px`;
    // console.log(player.score++);
    score.innerText = `Score: ${++player.score}`;
    window.requestAnimationFrame(gamePlay);
  }
}

function start() {
  // setting up game's configuration
  player.start = true;
  player.score = 0;

  //removing start screen

  if (startScreen.classList.contains("animate__flash")) {
    startScreen.classList.remove("animate__flash");
  }
  startScreen.style.opacity = 0;
  setTimeout(() => {
    startScreen.classList.add("hide");
  }, 200);

  //displaying score screen
  score.style.opacity = 1;
  score.classList.add("animate__zoomIn");

  //showing gameArea (racing track)
  gameArea.innerHTML = "";

  // creating players's car
  let car = document.createElement("div");
  car.setAttribute("style", `background-image:url("images/main_car.png")`);
  car.setAttribute("class", "car");
  gameArea.appendChild(car);

  //creating enemies' cars
  for (let x = 0; x < 5; x++) {
    let enemyCar = document.createElement("div");
    enemyCar.setAttribute("class", "enemy");
    enemyCar.y = (x + 1) * 300 * -1;
    enemyCar.setAttribute("style", `background-image:url("images/enemy_car${x + 1}.png")`);
    enemyCar.style.left = `${Math.round(Math.random() * 450)}px`;
    enemyCar.style.top = `${enemyCar.y}px`;
    gameArea.appendChild(enemyCar);
  }

  // creating racing track divider
  for (let x = 0; x < 10; x++) {
    let roadDivider = document.createElement("div");
    roadDivider.setAttribute("class", "lines");
    roadDivider.y = x * 125;
    roadDivider.style.top = `${x * 125}px`;
    gameArea.appendChild(roadDivider);
  }

  // initializing player's car starting pos
  player.x = car.offsetLeft;
  player.y = car.offsetTop;
  // console.log("x: ", player.x);
  // console.log("y: ", player.y);

  //starting the game UI
  window.requestAnimationFrame(gamePlay);
}
