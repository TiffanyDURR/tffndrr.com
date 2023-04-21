const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = document.documentElement.scrollHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let stars = [];
let lastStarTime = 0;

class Star {
  constructor(x, y, radius, alpha) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.alpha = alpha;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.scale(this.radius, this.radius);
    ctx.beginPath();
    ctx.moveTo(0, 0 - 1);
    for (let i = 0; i < 5; i++) {
      ctx.rotate(Math.PI / 5);
      ctx.lineTo(0, 0 - 1 * 0.5);
      ctx.rotate(Math.PI / 5);
      ctx.lineTo(0, 0 - 1);
    }
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.alpha -= 0.04;
    this.x += this.vx;
    this.y += this.vy;
  }
}
class TwinklingStar {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.alpha = 0;
    this.fadeInSpeed = 0.005 + Math.random() * 0.01;
    this.fadeOutSpeed = 0.005 + Math.random() * 0.01;
    this.fadeIn = true;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.restore();
  }

  update() {
    if (this.fadeIn) {
      this.alpha += this.fadeInSpeed;
      if (this.alpha >= 1) {
        this.fadeIn = false;
      }
    } else {
      this.alpha -= this.fadeOutSpeed;
      if (this.alpha <= 0) {
        stars.splice(stars.indexOf(this), 1);
      }
    }
  }
}

setInterval(() => {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const radius = Math.random() * 2;
  stars.push(new TwinklingStar(x, y, radius));
}, 100);

setInterval(() => {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const radius = Math.random() * 2;
  stars.push(new TwinklingStar(x, y, radius));
}, 500);

function addStar(e) {
  if (Date.now() - lastStarTime > 30) {
    const x = e.clientX;
    const y = e.clientY;
    const radius = Math.random() * 7 + 3;
    const alpha = 1;
    stars.push(new Star(x, y, radius, alpha));
    lastStarTime = Date.now();
  }
}

function explode(e) {
  const x = e.clientX;
  const y = e.clientY;
  for (let i = 0; i < 50; i++) {
    const radius = Math.random() * 5 + 2;
    const alpha = 1;
    const star = new Star(x, y, radius, alpha);
    star.vx *= 3;
    star.vy *= 3;
    stars.push(star);
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach((star) => {
    star.draw();
    star.update();
  });
  stars = stars.filter((star) => star.alpha > 0);
  requestAnimationFrame(animate);
}

canvas.addEventListener("mousemove", addStar);
canvas.addEventListener("click", explode);
animate();

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const touches = e.changedTouches;
  for (let i = 0; i < touches.length; i++) {
    addStar(touches[i]);
  }
});

const link = document.querySelector("#link");
const rocket = document.querySelector("#rocket");
link.addEventListener("click", (e) => {
  e.preventDefault();
  rocket.classList.add("fly");
  setTimeout(() => {
    rocket.classList.add("rotate");
    setTimeout(() => {
      rocket.classList.add("reverse");
      setTimeout(() => {
        rocket.classList.remove("fly");
        rocket.classList.remove("reverse");
        setTimeout(() => {
          window.location.hash = "portfolio";
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
});
