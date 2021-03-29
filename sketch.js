const numBubbles = 10;
const history = 300;
const randomSpeed = 1;
const drawTail = false;
const minCircleSize = 5;
const maxCircleSize = 10;
const playerAdvantage = 1.50;
const humanFace = "🐵"; //single character emoji to represent human player
let idNum = 0;
let bubbles = [];
let player;
let frame = 60;
let frameSlider;
let resetButton;

function setup() {
  ellipseMode(RADIUS);
  createCanvas(350, 500);
  createSpan("Juster hastigheten: ")
  frameSlider = createSlider(5, 60, 60, 5);
  createDiv(" ")
  resetButton = createButton("Start på nytt")
  resetButton.mousePressed(resetSketch);
  resetSketch();
}

function draw() {
  background(20);
  frameRate(frame);
  frame = frameSlider.value();
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].move();
    bubbles[i].display();
    bubbles[i].computeCollisions();
  }
  checkWinner();
}

class Bubble {
  constructor(x, y) {
    this.id = idNum;
    this.x = x;
    this.y = y;
    this.vx = random(-randomSpeed, randomSpeed);
    this.vy = random(-randomSpeed, randomSpeed);
    this.r = random(minCircleSize, maxCircleSize);
    this.cr = random(255);
    this.cg = random(255);
    this.cb = random(255);
    this.newx = x;
    this.newy = y;
    this.dragging = false;
    this.rollover = false;
    this.history = [];
    if (idNum == 0) {
      // growing the human player an advantage to make fewer unwinnable rounds
      this.r = random(minCircleSize * playerAdvantage, maxCircleSize);
    }
    idNum++;
  }

  move() {
    if (this.r < 3) {
      const index = bubbles.indexOf(this);
      console.log("Deleted " + this.id);
      bubbles.splice(index, 1);
    }

    if (this.x + this.r > width) {
      this.x = width - this.r;
    } else if (this.x - this.r < 0) {
      this.x = this.r;
    }
    if (this.y + this.r > height) {
      this.y = height - this.r;
    } else if (this.y - this.r < 0) {
      this.y = this.r;
    }
    if (mouseIsPressed) {
      let mousePlayerVector = createVector(player.x, player.y).sub(mouseX, mouseY);

      console.log(mousePlayerVector);

      player.vx += mousePlayerVector.x * 4e-5;
      player.vy += mousePlayerVector.y * 4e-5;
      player.r -= 0.003;
    }

    if (keyIsDown(UP_ARROW)) {
      player.vy += 0.001;
      player.r -= 0.003;
    } else if (keyIsDown(DOWN_ARROW)) {
      player.vy -= 0.001;
      player.r -= 0.003;
    } else if (keyIsDown(LEFT_ARROW)) {
      player.vx += 0.001;
      player.r -= 0.003;
    } else if (keyIsDown(RIGHT_ARROW)) {
      player.vx -= 0.001;
      player.r -= 0.003;
    }

    this.history.push(createVector(this.x, this.y));
    this.x = this.x + this.vx;
    this.y = this.y + this.vy;
    if ((this.x + this.r) > width || (this.x - this.r) < 0) {
      this.vx = -this.vx;
    }
    if ((this.y + this.r) > height || (this.y - this.r) < 0) {
      this.vy = -this.vy;
    }
    if (this.dragging === true) {
      this.x = mouseX;
      this.y = mouseY;
    }
  }

  display() {
    stroke(200);
    if (this.rollover === true) {
      fill(min(this.cr * 2, 255), min(this.cg * 2, 255), min(this.cb * 2, 255));
    } else if (this.id == 0) {
      fill(255, 0, 0);
    } else {
      fill(this.cr, this.cg, this.cb);
    }
    ellipse(this.x, this.y, this.r);
    stroke(0);
    if (this.id == 0) {
      textAlign(CENTER,CENTER)
      textSize(this.r - 1)
      text(humanFace, this.x,this.y);
    }
    fill(0);

    if (drawTail) {
      beginShape();
      noFill();
      for (let i = 0; i < this.history.length; i++) {
        vertex(this.history[i].x, this.history[i].y);
      }
      endShape();
    }
    if (this.history.length > history) {
      this.history.shift();
    }
  }

  computeCollisions() {
    for (const bubble of bubbles) {
      if (this.id != bubble.id) {
        let d = dist(this.x, this.y, bubble.x, bubble.y);
        if (d < this.r + bubble.r) {
          if (this.r > bubble.r) {
            const deltaR = sqrt(abs(this.r + bubble.r - d));
            const deceleration = (deltaR / this.r) ** 2;
            console.log(deceleration);
            this.vx = this.vx * (1 - deceleration);
            this.vy = this.vy * (1 - deceleration);
            this.r += deltaR;
            if (bubble.r < 3) {
              console.log("Deleted " + bubble.id);
              const index = bubbles.indexOf(bubble);
              bubbles.splice(index, 1);
            }
          } else {
            this.r -= sqrt(abs(this.r + bubble.r - d));
            if (this.r < 3) {
              console.log("Deleted " + this.id);
              const index = bubbles.indexOf(this);
              bubbles.splice(index, 1);
            }
          }
        }
      }
    }
  }

}

function checkWinner() {
  if (bubbles.length == 1 && bubbles[0].id == 0) {
    fill(220);
    text("Gratulerer!! 🥳", width/2, height/2);
  }
}

function resetSketch() {
  idNum = 0;
  bubbles = [];
  player = new Bubble(random(maxCircleSize, width - maxCircleSize), random(maxCircleSize, height - maxCircleSize));
  bubbles[0] = player;
  for (let i = 1; i < numBubbles; i++) {
    stroke(255);
    bubbles[i] = new Bubble(random(maxCircleSize, width - maxCircleSize), random(maxCircleSize, height - maxCircleSize));
  }
}

function keyPressed() {
  if (key == "r") {
    resetSketch();
  }
}