const numBubbles = 20;
const history = 1000;
const randomMoveDistance = 2;
const drawTail = true;
const minCircleSize = 10;
const maxCircleSize = 25;
let bubbles = [];

function setup() {
  ellipseMode(RADIUS);
  frameRate(60);
  createCanvas(600, 400);
  for (let i = 0; i < numBubbles; i++) {
    stroke(255);
    bubbles[i] = new Bubble(random(width), random(height));
  }
}

function draw() {
  background(20);
  for (let i = 0; i < numBubbles; i++) {
    bubbles[i].move();
    bubbles[i].over();
    bubbles[i].display();
  }
  // noLoop();
}

class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = random(minCircleSize, maxCircleSize);
    this.cr = random(255);
    this.cg = random(255);
    this.cb = random(255);
    this.newx = x;
    this.newy = y;
    this.dragging = false;
    this.rollover = false;
    this.history = [];
  }

  move() {
    this.history.push(createVector(this.x, this.y));
    this.x += random(-randomMoveDistance, randomMoveDistance);
    this.y += random(-randomMoveDistance, randomMoveDistance);
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
    if (drawTail) {
      beginShape(LINES);
      for (let i = 0; i < this.history.length; i++) {
        vertex(this.history[i].x, this.history[i].y);
      }
      endShape();
    }
    if (this.history.length > history) {
      this.history.shift();
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
    if (this.rollover == true) {
      this.dragging = true;
      this.newx = mouseX;
      this.newy = mouseY;
      console.log("mouse pressed on circle");
    } else {
      this.dragging = false;
    }
  }

  circleReleased() {
    this.dragging = false;
  }

}

function mousePressed() {
  for (let i = 0; i < numBubbles; i++) {
    bubbles[i].circleClicked();
  }
}

function mouseReleased() {
  for (let i = 0; i < numBubbles; i++) {
    bubbles[i].circleReleased();
  }
}
function touchStarted() {
  for (let i = 0; i < numBubbles; i++) {
    bubbles[i].circleClicked();
  }
}

function touchEnded() {
  for (let i = 0; i < numBubbles; i++) {
    bubbles[i].circleReleased();
  }
}