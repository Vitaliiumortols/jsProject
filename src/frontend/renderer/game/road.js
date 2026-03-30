const roadCanvas = document.getElementById("roadCanvas");
const roadCtx = roadCanvas.getContext("2d");

const sunImg = new Image();
sunImg.src = "../images/carImages/sun.png";

let roadOffset = 0;
let roadShift = 0;
let isGameOver = false;
let coneDensity = 0.5;
let gameSpeed = 0.5;
let isGameStarted = false;
let score = 0;
let level = 0;

const baseGameSpeed = 0.5;   
const baseConeDensity = 0.5;

const scoreStep = 300;
const speedStep = 0.05;
const densityStep = 0.03;


const roadKeys = {
  ArrowLeft: false,
  ArrowRight: false,
  KeyA: false,
  KeyD: false
};

const obstacles = [];
let obstacleSpawnTimer = 0;

let lastSpawnLaneIndex = -1;

const coneLanes = [-0.72, -0.36, 0, 0.36, 0.72];
const laneJitter = 0.07;

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function easeIn(t) {
  return t * t;
}

function smoothStep(t) {
  return t * t * (3 - 2 * t);
}

function drawStartButton() {
  const btnW = 220;
  const btnH = 70;
  const x = roadCanvas.width / 2 - btnW / 2;
  const y = roadCanvas.height / 2 + 40;

  roadCtx.fillStyle = "#fff";
  roadCtx.fillRect(x, y, btnW, btnH);
  roadCtx.fillStyle = "#000";
  roadCtx.fillRect(x + 4, y + 4, btnW - 8, btnH - 8);
  roadCtx.fillStyle = "#fff";
  roadCtx.fillRect(x + 8, y + 8, btnW - 16, btnH - 16);

  roadCtx.fillStyle = "#000";
  roadCtx.font = "bold 24px 'Courier New', monospace";
  roadCtx.textAlign = "center";
  roadCtx.fillText("START", roadCanvas.width / 2, y + 43);

  return { x, y, btnW, btnH };
}

function drawSky() {
  const gradient = roadCtx.createLinearGradient(0, 0, 0, 320);
  gradient.addColorStop(0, "#2f1b3d");
  gradient.addColorStop(1, "#4a295a");
  roadCtx.fillStyle = gradient;
  roadCtx.fillRect(0, 0, roadCanvas.width, roadCanvas.height);

  if (sunImg.complete) {
    const sunWidth = 320;
    const sunHeight = 320;
    const sunX = roadCanvas.width / 2 - sunWidth / 2;
    const sunY = 40;

    roadCtx.drawImage(sunImg, sunX, sunY, sunWidth, sunHeight);
  }
}
function getRoadData() {
  const topCenterX = roadCanvas.width / 2;
  const bottomCenterX = roadCanvas.width / 2 + roadShift;
  const horizonY = 250;
  const bottomY = roadCanvas.height;
  const topRoadWidth = 30;
  const bottomRoadWidth = 1400;
  const topShoulderWidth = 14;
  const bottomShoulderWidth = 42;

  return {
    topCenterX,
    bottomCenterX,
    horizonY,
    bottomY,
    topRoadWidth,
    bottomRoadWidth,
    topShoulderWidth,
    bottomShoulderWidth
  };
}

function updateRoadShift() {
  if (isGameOver) return;

  const moveSpeed = 10;
  const maxShift = 560;

  if (roadKeys.ArrowLeft || roadKeys.KeyA) roadShift += moveSpeed;
  if (roadKeys.ArrowRight || roadKeys.KeyD) roadShift -= moveSpeed;

  roadShift = clamp(roadShift, -maxShift, maxShift);
}

function drawGround() {
  const { horizonY, bottomY } = getRoadData();
  const gradient = roadCtx.createLinearGradient(0, horizonY, 0, bottomY);
  gradient.addColorStop(0, "#140f23");
  gradient.addColorStop(1, "#07060d");
  roadCtx.fillStyle = gradient;
  roadCtx.fillRect(0, horizonY, roadCanvas.width, bottomY - horizonY);
}

function roadWidthAt(t, topWidth, bottomWidth) {
  return topWidth + (bottomWidth - topWidth) * easeIn(t);
}

function yAt(t, horizonY, bottomY) {
  return horizonY + (bottomY - horizonY) * easeIn(t);
}

function centerXAt(t, topCenterX, bottomCenterX) {
  return topCenterX + (bottomCenterX - topCenterX) * easeIn(t);
}

function drawRoad() {
  const {
    topCenterX,
    bottomCenterX,
    horizonY,
    bottomY,
    topRoadWidth,
    bottomRoadWidth,
    topShoulderWidth,
    bottomShoulderWidth
  } = getRoadData();

  const leftRoadTop = topCenterX - topRoadWidth / 2;
  const rightRoadTop = topCenterX + topRoadWidth / 2;
  const leftRoadBottom = bottomCenterX - bottomRoadWidth / 2;
  const rightRoadBottom = bottomCenterX + bottomRoadWidth / 2;

  const leftShoulderTop = leftRoadTop - topShoulderWidth;
  const rightShoulderTop = rightRoadTop + topShoulderWidth;
  const leftShoulderBottom = leftRoadBottom - bottomShoulderWidth;
  const rightShoulderBottom = rightRoadBottom + bottomShoulderWidth;

  roadCtx.fillStyle = "#b86cff";
  roadCtx.beginPath();
  roadCtx.moveTo(leftShoulderTop, horizonY);
  roadCtx.lineTo(leftRoadTop, horizonY);
  roadCtx.lineTo(leftRoadBottom, bottomY);
  roadCtx.lineTo(leftShoulderBottom, bottomY);
  roadCtx.closePath();
  roadCtx.fill();

  roadCtx.beginPath();
  roadCtx.moveTo(rightRoadTop, horizonY);
  roadCtx.lineTo(rightShoulderTop, horizonY);
  roadCtx.lineTo(rightShoulderBottom, bottomY);
  roadCtx.lineTo(rightRoadBottom, bottomY);
  roadCtx.closePath();
  roadCtx.fill();

  roadCtx.fillStyle = "#5a5b64";
  roadCtx.beginPath();
  roadCtx.moveTo(leftRoadTop, horizonY);
  roadCtx.lineTo(rightRoadTop, horizonY);
  roadCtx.lineTo(rightRoadBottom, bottomY);
  roadCtx.lineTo(leftRoadBottom, bottomY);
  roadCtx.closePath();
  roadCtx.fill();
}

function drawLaneMarks() {
  const {
    topCenterX,
    bottomCenterX,
    horizonY,
    bottomY,
    topRoadWidth,
    bottomRoadWidth
  } = getRoadData();

  const segmentCount = 8;
  const cycle = 1 / segmentCount;

  for (let i = 0; i < segmentCount; i++) {
    const startT = (i * cycle + roadOffset) % 1;
    const endT = startT + cycle * 0.42;
    if (endT > 1) continue;

    const y1 = yAt(startT, horizonY, bottomY);
    const y2 = yAt(endT, horizonY, bottomY);
    const width1 = roadWidthAt(startT, topRoadWidth, bottomRoadWidth);
    const width2 = roadWidthAt(endT, topRoadWidth, bottomRoadWidth);
    const center1 = centerXAt(startT, topCenterX, bottomCenterX);
    const center2 = centerXAt(endT, topCenterX, bottomCenterX);

    const halfMarkWidth1 = Math.max(2, width1 * 0.006);
    const halfMarkWidth2 = Math.max(3, width2 * 0.006);

    roadCtx.fillStyle = "#ffffff";
    roadCtx.beginPath();
    roadCtx.moveTo(center1 - halfMarkWidth1, y1);
    roadCtx.lineTo(center1 + halfMarkWidth1, y1);
    roadCtx.lineTo(center2 + halfMarkWidth2, y2);
    roadCtx.lineTo(center2 - halfMarkWidth2, y2);
    roadCtx.closePath();
    roadCtx.fill();
  }
}

function spawnObstacle() {
  if (isGameOver) return;

  let laneIndex = Math.floor(Math.random() * coneLanes.length);

  if (laneIndex === lastSpawnLaneIndex && Math.random() < 0.7) {
    const available = [];
    for (let i = 0; i < coneLanes.length; i++) {
      if (i !== lastSpawnLaneIndex) available.push(i);
    }
    laneIndex = available[Math.floor(Math.random() * available.length)];
  }

  lastSpawnLaneIndex = laneIndex;

  const laneBase = coneLanes[laneIndex];
  const laneRatio = clamp(
    laneBase + randomRange(-laneJitter, laneJitter),
    -0.78,
    0.78
  );

  obstacles.push({
    laneRatio,
    t: -0.18
  });
}
function checkCollision(x, baseY, baseW, h) {
  const playerWidth = 300;
  const playerHeight = 20;
  const playerX = roadCanvas.width / 2 - playerWidth / 2;
  const playerY = roadCanvas.height - 60;

  const playerHitX = playerX + playerWidth * 0.18;
  const playerHitY = playerY + playerHeight * 0.18;
  const playerHitW = playerWidth * 0.64;
  const playerHitH = playerHeight * 0.62;

  const coneCenterX = x;
  const coneCenterY = baseY - h * 0.06;
  const coneRadiusX = baseW * 0.22;
  const coneRadiusY = Math.max(4, h * 0.075);

  const nearestX = clamp(coneCenterX, playerHitX, playerHitX + playerHitW);
  const nearestY = clamp(coneCenterY, playerHitY, playerHitY + playerHitH);

  const dx = coneCenterX - nearestX;
  const dy = coneCenterY - nearestY;

  const hit =
    (dx * dx) / (coneRadiusX * coneRadiusX) +
    (dy * dy) / (coneRadiusY * coneRadiusY) <= 1;

  if (hit) {
    isGameOver = true;
  }
}

function updateObstacles() {
  if (isGameOver) return;

  obstacleSpawnTimer++;

  const spawnDelay = Math.max(10, 70 / (gameSpeed * coneDensity));
  if (obstacleSpawnTimer >= spawnDelay) {
    spawnObstacle();
    obstacleSpawnTimer = 0;
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obstacle = obstacles[i];
    obstacle.t += 0.0075 * gameSpeed;

    if (obstacle.t > 1) {
      obstacles.splice(i, 1);
    }
  }
}

function drawCone(obstacle) {
  const {
    topCenterX,
    bottomCenterX,
    horizonY,
    bottomY,
    topRoadWidth,
    bottomRoadWidth
  } = getRoadData();

  const rawT = obstacle.t;

  const roadT = clamp(rawT, 0, 1);

  const center = centerXAt(roadT, topCenterX, bottomCenterX);
  const roadWidth = roadWidthAt(roadT, topRoadWidth, bottomRoadWidth);

  const horizonLift = rawT < 0 ? (-rawT * 140) : 0;

  let extraDrop = 0;
  if (rawT > 1) {
    extraDrop = (rawT - 1) * 900;
  }

  const baseY = yAt(roadT, horizonY, bottomY) - horizonLift + extraDrop;
  const x = center + obstacle.laneRatio * (roadWidth * 0.5);

  const scale = easeIn(roadT);
  const appear = clamp((rawT + 0.18) / 0.18, 0, 1);
  const appearEase = smoothStep(appear);

  const h = Math.max(1, 110 * scale);
  const baseW = Math.max(1, 90 * scale);
  const coneW = baseW * 0.75;
  const topY = baseY - h;

  if (rawT > 0.8 && rawT < 1.02 && appearEase > 0.92) {
    checkCollision(x, baseY, baseW, h);
  }
  roadCtx.save();
  roadCtx.globalAlpha = appearEase;

  roadCtx.fillStyle = "rgba(0,0,0,0.28)";
  roadCtx.beginPath();
  roadCtx.ellipse(x, baseY, baseW * 0.6, baseW * 0.18, 0, 0, Math.PI * 2);
  roadCtx.fill();

  roadCtx.fillStyle = "#1a1a1a";
  roadCtx.beginPath();
  roadCtx.moveTo(x - baseW / 2, baseY);
  roadCtx.lineTo(x + baseW / 2, baseY);
  roadCtx.lineTo(x + baseW * 0.4, baseY - h * 0.1);
  roadCtx.lineTo(x - baseW * 0.4, baseY - h * 0.1);
  roadCtx.closePath();
  roadCtx.fill();

  roadCtx.fillStyle = "#FF5500";
  roadCtx.beginPath();
  roadCtx.moveTo(x - coneW / 2, baseY - h * 0.08);
  roadCtx.lineTo(x + coneW / 2, baseY - h * 0.08);
  roadCtx.lineTo(x + Math.max(0.5, 2 * scale), topY);
  roadCtx.lineTo(x - Math.max(0.5, 2 * scale), topY);
  roadCtx.closePath();
  roadCtx.fill();

  if (appearEase > 0.2) {
    roadCtx.fillStyle = "#FFFFFF";
    roadCtx.beginPath();
    roadCtx.moveTo(x - coneW * 0.25, baseY - h * 0.4);
    roadCtx.lineTo(x + coneW * 0.25, baseY - h * 0.4);
    roadCtx.lineTo(x + coneW * 0.22, baseY - h * 0.55);
    roadCtx.lineTo(x - coneW * 0.22, baseY - h * 0.55);
    roadCtx.closePath();
    roadCtx.fill();
  }

  roadCtx.restore();
}
function drawRestartButton() {
  const btnW = 220;
  const btnH = 70;
  const x = roadCanvas.width / 2 - btnW / 2;
  const y = roadCanvas.height / 2 + 60;

  roadCtx.fillStyle = "#fff";
  roadCtx.fillRect(x, y, btnW, btnH);
  roadCtx.fillStyle = "#000";
  roadCtx.fillRect(x + 4, y + 4, btnW - 8, btnH - 8);
  roadCtx.fillStyle = "#fff";
  roadCtx.fillRect(x + 8, y + 8, btnW - 16, btnH - 16);

  roadCtx.fillStyle = "#000";
  roadCtx.font = "bold 24px 'Courier New', monospace";
  roadCtx.textAlign = "center";
  roadCtx.fillText("RESTART", roadCanvas.width / 2, y + 43);

  return { x, y, btnW, btnH };
}

function resetGame() {
  obstacles.length = 0;
  roadShift = 0;
  isGameOver = false;
  isGameStarted = true;
  obstacleSpawnTimer = 0;
  roadOffset = 0;
  lastSpawnLaneIndex = -1;
  score = 0;
  level = 0;
  gameSpeed = 0.5;
  coneDensity = 0.5;

  roadKeys.ArrowLeft = false;
  roadKeys.ArrowRight = false;
  roadKeys.KeyA = false;
  roadKeys.KeyD = false;
}

function renderRoad() {
  if (isGameStarted && !isGameOver) {
    updateRoadShift();
  }

  roadCtx.clearRect(0, 0, roadCanvas.width, roadCanvas.height);

  drawSky();
  drawGround();
  drawRoad();
  drawLaneMarks();

  if (isGameStarted && !isGameOver) {
    updateObstacles();
    drawScore();
  }

  const sorted = [...obstacles].sort((a, b) => a.t - b.t);
  sorted.forEach(drawCone);

  if (!isGameStarted) {
    roadCtx.fillStyle = "rgba(0,0,0,0.55)";
    roadCtx.fillRect(0, 0, roadCanvas.width, roadCanvas.height);

    roadCtx.fillStyle = "#FF00FF";
    roadCtx.font = "900 56px 'Courier New', monospace";
    roadCtx.textAlign = "center";
    roadCtx.shadowColor = "cyan";
    roadCtx.shadowBlur = 10;
    roadCtx.fillText("RETRO DRIVE", roadCanvas.width / 2, roadCanvas.height / 2 - 30);
    roadCtx.shadowBlur = 0;

    drawStartButton();
  }

  if (isGameOver) {
    roadCtx.fillStyle = "rgba(0,0,0,0.75)";
    roadCtx.fillRect(0, 0, roadCanvas.width, roadCanvas.height);

    roadCtx.fillStyle = "#FF00FF";
    roadCtx.font = "900 64px 'Courier New', monospace";
    roadCtx.textAlign = "center";
    roadCtx.shadowColor = "cyan";
    roadCtx.shadowBlur = 10;
    roadCtx.fillText("CRASHED!", roadCanvas.width / 2, roadCanvas.height / 2 - 20);
    roadCtx.shadowBlur = 0;

    drawRestartButton();
  }
}

function animateRoad() {
  if (isGameStarted && !isGameOver) {
    roadOffset = (roadOffset + 0.009 * gameSpeed) % 1;

    score += 0.6 * gameSpeed;
    updateDifficulty();
  }

  renderRoad();
  requestAnimationFrame(animateRoad);
}

function drawScore() {
  roadCtx.save();
  roadCtx.fillStyle = "#00f2ff"; 
  roadCtx.font = "bold 20px 'Courier New', monospace";
  roadCtx.textAlign = "left";
  roadCtx.shadowColor = "cyan";
  roadCtx.shadowBlur = 5;
  
  roadCtx.fillText(`SCORE: ${Math.floor(score)}`, 20, 40);
  roadCtx.fillText(`LEVEL: ${level}`, 20, 70);
  roadCtx.restore();
}

roadCanvas.addEventListener("click", (e) => {
  const rect = roadCanvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (!isGameStarted) {
    const btnX = roadCanvas.width / 2 - 110;
    const btnY = roadCanvas.height / 2 + 40;

    if (
      mouseX > btnX &&
      mouseX < btnX + 220 &&
      mouseY > btnY &&
      mouseY < btnY + 70
    ) {
      isGameStarted = true;
    }
    return;
  }

  if (!isGameOver) return;

  const btnX = roadCanvas.width / 2 - 110;
  const btnY = roadCanvas.height / 2 + 60;

  if (
    mouseX > btnX &&
    mouseX < btnX + 220 &&
    mouseY > btnY &&
    mouseY < btnY + 70
  ) {
    resetGame();
  }
});

function updateDifficulty() {
  const newLevel = Math.floor(score / scoreStep);

  if (newLevel !== level) {
    level = newLevel;
    gameSpeed = baseGameSpeed + level * speedStep;
    coneDensity = baseConeDensity + level * densityStep;
  }
}

window.addEventListener("keydown", (e) => {
  if (e.code in roadKeys) roadKeys[e.code] = true;
});

window.addEventListener("keyup", (e) => {
  if (e.code in roadKeys) roadKeys[e.code] = false;
});


function toggleRetroTheme(isActive) {
  if (isActive) {
      document.body.classList.add('retro-mode');
      console.log("Фиолетовый неон активирован!");
  } else {
      document.body.classList.remove('retro-mode');
      isGameStarted = false;
      isGameOver = false;
      console.log("Вернулись в бизнес-стиль");
  }
}

animateRoad();