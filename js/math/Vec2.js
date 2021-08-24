import { round } from "./Utilities.js";
export class Vec2 {
  /**
   * @param {Vec2 |number} x
   * @param {number|undefined} y
   */
  constructor(x, y = undefined) {
    this.x = Vec2.getX(x, y);
    this.y = Vec2.getY(x, y);
  }
  /**
   *  @param  {number|Vec2} y
   *  @param {number|undefined} x
   *  @return {number} The x axis
   **/
  static getX(x, y = undefined) {
    if (x instanceof Vec2) return x.x;
    return x;
  }
  /**
   *  @param  {number|Vec2} x
   *  @param  {number|undefined} y
   *  @return {number} The y axis
   **/
  static getY(x, y = undefined) {
    if (x instanceof Vec2) return x.y;
    if (y == undefined) return x;
    return y;
  }
  /**
   *  @param  {number|Vec2} x
   *  @param  {number|undefined} y
   *  @return {Vec2} The result vector
   **/
  mul(x, y = undefined) {
    this.x *= Vec2.getX(x, y);
    this.y *= Vec2.getY(x, y);
    return this;
  }
  /**
   *  @param  {number|Vec2} x The Vector or the scalar value can't be 0
   *  @param  {number|undefined}  y The scalar value can't be 0
   *  @return {Vec2} The result vector
   **/
  div(x, y = undefined) {
    (x = Vec2.getX(x, y)), (y = Vec2.getY(x, y));
    if (x == 0 && y == 0) {
      this.x = 0;
      this.y = 0;
      return this;
    }
    this.x /= x;
    this.y /= y;
    return this;
  }
  /**
   *  @param  {number|Vec2} x
   *  @param  {number|undefined} y
   *  @return {Vec2} The result vector
   **/
  add(x, y = undefined) {
    this.x += Vec2.getX(x, y);
    this.y += Vec2.getY(x, y);
    return this;
  }
  /**
   *  @param  {number|Vec2} x
   *  @param  {number|undefined} y
   *  @return {Vec2} The result vector
   **/
  sub(x, y = undefined) {
    this.x -= Vec2.getX(x, y);
    this.y -= Vec2.getY(x, y);
    return this;
  }
  /**
   *  @return {number} The length squared
   **/
  LentghSQRT() {
    return this.x * this.x + this.y * this.y;
  }
  /**
   *
   * @return {number} The length
   */
  Lentgh() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  /**
   *
   * @return {Vec2} The vec2 normalize
   */
  normalize() {
    let l = this.Lentgh();
    return this.mul(1 / l).round();
  }
  /**
   *
   * @param {Vec2} v The Vector to multiply
   * @return {number} The dot product
   */
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }
  /**
   *
   * @param {Vec2} v The vector to multiply
   * @return {number} The cross product
   */
  cross(v) {
    return this.x * v.y - this.y * v.x;
  }
  /**
   * @return {Number} The angle(Radiands) of this vector
   */
  angle() {
    return Math.atan2(this.y, this.x);
  }
  round() {
    this.x = round(this.x);
    this.y = round(this.y);
    return this;
  }
  copy() {
    return new Vec2(this.x, this.y);
  }
  /**
   *
   * @param {Vec2} v The Vector where proj this Vector
   * @return {Vec2} The vector proj
   */
  static proj(v, v1) {
    return new Vec2(v1).mul(v.dot(v1) / v1.LentghSQRT());
  }
  /**
   *
   * @param {Vec2} n The normal normalize
   * @return The reflec Vector
   */
  static reflec(v, n) {
    return new Vec2(v).sub(Vec2.proj(v, n).mul(2)).round();
  }
}
