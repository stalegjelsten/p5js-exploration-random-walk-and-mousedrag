const numBubbles = 10;
const history = 300;
const randomSpeed = 0.5;
const drawTail = false;
const minCircleSize = 5;
const maxCircleSize = 10;
let idNum = 0;
let bubbles = [];

function setup() {
  ellipseMode(RADIUS);
  frameRate(60);
  createCanvas(350, 500);
  for (let i = 0; i < numBubbles; i++) {
    stroke(255);
    bubbles[i] = new Bubble(random(maxCircleSize, width - maxCircleSize), random(maxCircleSize, height - maxCircleSize));
  }
}

function draw() {
  background(20);
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].move();
    bubbles[i].over();
    bubbles[i].display();
    bubbles[i].computeCollisions();
  }
  // noLoop();
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
    } else if (this.x - this.r < 0) {
      this.x = this.r;
    }
    if (this.y + this.r > height) {
      this.y = height - this.r;
    } else if (this.y - this.r < 0) {
      this.y = this.r;
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
    } else {
      fill(this.cr, this.cg, this.cb);
    }
    ellipse(this.x, this.y, this.r);
    stroke(0);
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
            const deceleration = deltaR / this.r;
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

  over() {
    if ((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2 < this.r ** 2) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  }

  circleClicked() {
    if ((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2 < this.r ** 2) {
      this.dragging = true;
      this.newx = mouseX;
      this.newy = mouseY;
    } else {
      this.dragging = false;
    }
  }

  circleReleased() {
    this.dragging = false;
  }

}

function mousePressed() {
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].circleClicked();
  }
}

function mouseReleased() {
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].circleReleased();
  }
}
function touchStarted() {
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].circleClicked();
  }
}

function touchEnded() {
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].circleReleased();
  }
}