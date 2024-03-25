const grid = document.querySelector(".grid");
const doodler = document.createElement("div");
let doodleLeft = 100;
let doodleBottom = 200;
let startGame = true;
let platforms = [];
let lose = false;
let lastTime = 0;
let jumpCheck = false;
function createDoodle() {
  grid.appendChild(doodler);
  doodler.classList.add("doodler");
  doodler.style.left = doodleLeft + "px";
  doodler.style.bottom = doodleBottom + "px";
}

class Platform {
  constructor(platformBottom) {
    this.bottom = platformBottom;
    this.left = Math.random() * 320;
    this.visual = document.createElement("div");
    const visual = this.visual;
    grid.appendChild(visual);
    visual.classList.add("platform");
    visual.style.left = this.left + "px";
    visual.style.bottom = this.bottom + "px";
  }
}

function createPlatform(n) {
  for (i = 0; i < n; i++) {
    let platformGap = 600 / n;
    let platformBottom = 100 + i * platformGap;
    let newPlatform = new Platform(platformBottom);
    platforms.push(newPlatform);
  }
}
function updatePlatform() {
  platforms.forEach((platform) => {
    if (platform.bottom < 1) {
      platform.bottom = 600;
      const visual = platform.visual;
      platform.left = Math.random() * 320;
      visual.style.left = platform.left + "px";
      visual.style.bottom = platform.bottom + "px";
    }
  });
}
function updateDoodler(time) {
  const delta = time - lastTime;
  lastTime = time;
  checkContact();
  checkLose();
  movePlatforms();
  updatePlatform();

  if (!lose) {
    if (jumpCheck) {
      jump(delta);
    } else {
      gravity(delta);
    }

    window.requestAnimationFrame(updateDoodler);
  }
}
function movePlatforms() {
  if (doodleBottom > 300) {
    platforms.forEach((platform) => {
      platform.bottom -= 5;
      const visual = platform.visual;
      visual.style.bottom = platform.bottom + "px";
    });
  }
}
function doodlerCtrl() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      doodleLeft -= 10;
      doodler.style.left = doodleLeft + "px";
    } else if (e.key === "ArrowRight") {
      doodleLeft += 10;
      doodler.style.left = doodleLeft + "px";
    }
  });
}
function jump(delta) {
  doodleBottom += 1 * 0.3 * delta;
  doodler.style.bottom = doodleBottom + "px";
  if (doodleBottom > 400) {
    jumpCheck = false;
  }
}
function gravity(delta) {
  doodleBottom -= 1 * 0.3 * delta;
  doodler.style.bottom = doodleBottom + "px";
}
function checkLose() {
  if (doodleBottom < 0) {
    lose = true;
  }
}
function doodlerRect() {
  return doodler.getBoundingClientRect();
}

function checkContact() {
  platforms.forEach((platform) => {
    const platformRect = platform.visual.getBoundingClientRect();
    const doodleR = doodlerRect();

    const checkX =
      doodleR.left < platformRect.right && doodleR.right > platformRect.left;
    const checkY =
      platformRect.bottom > doodleR.bottom && doodleR.bottom > platformRect.top;

    if (checkX && checkY) {
      jumpCheck = true;
      setTimeout(() => {
        jumpCheck = false;
      }, 1000);
    }
  });
}

function start() {
  if (startGame) {
    doodlerCtrl();
    window.requestAnimationFrame(updateDoodler);
    createPlatform(5);
    doodleLeft = platforms[0].left;
    createDoodle();
  }
}

start();
