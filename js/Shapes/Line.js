import { Vec2 } from "../math/Vec2.js";

export class Line {
  constructor(p1, p2) {
    this.x1 = p1[0];
    this.y1 = p1[1];
    this.x2 = p2[0];
    this.y2 = p2[1];
    
  }
  normal() {
    return new Vec2(this.y1 - this.y2, this.x2 - this.x1).normalize().round();
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
  }
}
