import { round } from "../math/Utilities.js";
export class Particle {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.dir_length = this.dir.LentghSQRT();
  }
  update(currentTime) {
    this.x += this.dir.x;
    this.y += this.dir.y;
  }
  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.dir.x * 5, this.y + this.dir.y * 5);
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
    ctx.fill();
  }
  copy() {
    return new Particle(this.x, this.y, this.dir.copy());
  }
}
