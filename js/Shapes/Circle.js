import { Vec2 } from "../math/Vec2.js";
export class Circle {
  constructor(x, y, r, fill = false) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.fill = fill;
  }
  normal(p) {
    return new Vec2(-p.x + this.x, -p.y + this.y).normalize().round();
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    if (this.fill) ctx.fill();
    else ctx.stroke();
  }
}
