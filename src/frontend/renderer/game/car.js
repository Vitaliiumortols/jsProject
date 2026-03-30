const playerCar = document.getElementById("playerCar");

const carSprites = {
  center: "../images/carImages/gt_frame_0.png",
  left: "../images/carImages/gt_turn_left.png",
  right: "../images/carImages/gt_turn_right.png"
};

const carKeys = {
    ArrowLeft: false,
    ArrowRight: false,
    KeyA: false,
    KeyD: false
  };

function updateCarSprite() {
  const leftPressed = carKeys.ArrowLeft || carKeys.KeyA;
  const rightPressed = carKeys.ArrowRight || carKeys.KeyD;

  if (leftPressed && !rightPressed) {
    playerCar.src = carSprites.left;
  } else if (rightPressed && !leftPressed) {
    playerCar.src = carSprites.right;
  } else {
    playerCar.src = carSprites.center;
  }
}

window.addEventListener("keydown", (e) => {
  if (e.code in carKeys) {
    carKeys[e.code] = true;
    updateCarSprite();
  }
});

window.addEventListener("keyup", (e) => {
  if (e.code in carKeys) {
    carKeys[e.code] = false;
    updateCarSprite();
  }
});

updateCarSprite();