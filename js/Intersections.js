import { Vec2 } from "./math/Vec2.js";
import { Rect, Line, Circle } from "./Shapes/Shapes.js";
export const OUT_NEGATIVE = 1;
export const OUT_IN_NEGATIVE = 2;
export const IN = 3;
export const OUT = 4;
export const OUT_IN_POSITIVE = 5;
export const OUT_POSITIVE = 6;
function round(val) {
  return Math.floor(val * 1000) / 1000;
}
function is_in_range(t, range) {
  return (
    (range == OUT_NEGATIVE && t <= 0) ||
    (range == OUT_IN_NEGATIVE && t <= 1) ||
    (range == IN && 0 <= t && t <= 1) ||
    (range == OUT_IN_POSITIVE && 0 <= t) ||
    (range == OUT_POSITIVE && 1 <= t) ||
    (range == OUT && (t <= 0 || 1 <= t))
  );
}
/**
 *
 * @param {Line} l
 * @param {Line} l1
 * @param {OUT_NEGATIVE|OUT_POSITIVE|IN} range
 * @return {undefined|vec2}
 */
export function intersect_line_line(l, l1, range) {
  let v1_x = l.x1 - l.x2;
  let v1_y = l.y1 - l.y2;

  let v2_x = l1.x1 - l1.x2;
  let v2_y = l1.y1 - l1.y2;

  let v3_x = l1.x2 - l.x2;
  let v3_y = l1.y2 - l.y2;

  let u = v3_x * v1_y - v3_y * v1_x;
  let d = v1_x * v2_y - v1_y * v2_x;

  if (d == 0) return;

  let t = round(u / d);
  let t1 = round((v2_y * t + v3_y) / v1_y);
  if (0 <= t && t <= 1 && is_in_range(t1, range)) {
    let normal = l1.normal();
    return {
      x: round(v2_x * t + l1.x2),
      y: round(v2_y * t + l1.y2),
      shape: l1,
      normal: normal.x * v1_x + normal.y * v1_y >= 0 ? normal.mul(-1) : normal,
    };
  }
  return;
}

/**
 *
 * @param {Line} _l
 * @param {Circle} _c
 * @return {Vec2[]}
 */
export function intersect_circle_line(_l, _c, range) {
  let v1_x = _l.x1 - _l.x2;
  let v1_y = _l.y1 - _l.y2;

  let c = v1_x * v1_x + v1_y * v1_y;

  let b = -2 * ((_c.x - _l.x2) * v1_x + (_c.y - _l.y2) * v1_y);

  let a =
    -2 * (_c.x * _l.x2 + _c.y * _l.y2) +
    _l.x2 * _l.x2 +
    _l.y2 * _l.y2 +
    _c.x * _c.x +
    _c.y * _c.y -
    _c.r * _c.r;

  let u = b * b - 4 * c * a;
  if (u < 0) return [];
  u = Math.sqrt(u);

  let t = round((u - b) / (2 * c));
  let t1 = round((-u - b) / (2 * c));

  let res = [];
  if (is_in_range(t, range)) {
    res.push({
      x: round(v1_x * t + _l.x2),
      y: round(v1_y * t + _l.y2),
    });
  }
  if (is_in_range(t1, range)) {
    res.push({
      x: round(v1_x * t1 + _l.x2),
      y: round(v1_y * t1 + _l.y2),
    });
  }
  return res.map((item) => {
    let normal = _c.normal(item);
    return {
      ...item,
      shape: _c,
      normal: normal.x * v1_x + normal.y * v1_y >= 0 ? normal.mul(-1) : normal,
    };
  });
}
/**
 *
 * @param {Line} _l
 * @param {Rect} r
 * @return {Vec2[]}
 */
export function intersect_line_rect(_l, r, range) {
  let lines = [
    new Line([r.x, r.y], [r.x + r.w, r.y]),
    new Line([r.x, r.y], [r.x, r.y + r.h]),
    new Line([r.x + r.w, r.y], [r.x + r.w, r.y + r.h]),
    new Line([r.x, r.y + r.h], [r.x + r.w, r.y + r.h]),
  ];
  let intersect = [];
  for (let line of lines) {
    let p = intersect_line_line(_l, line, range);
    if (p) intersect.push({ ...p, shape: r });
  }
  return intersect;
}
/**
 *
 * @param {Line} _l
 * @param {Rect|Line|Circle} o
 */
function remake_intersections(l, error) {
  let aux = [...l];
  for (let i = 0; i < l.length; i++) {
    for (let j = 0; j < l.length; j++) {
      if (
        j != i &&
        (l[i].x - l[j].x) ** 2 + (l[i].y - l[j].y) ** 2 <= error * error
      ) {
        aux = aux.splice(i, 1);
        aux = aux.splice(j, 1);
        aux.push({
          x: (l[i].x + l[j].x) / 2,
          y: (l[i].y + l[j].y) / 2,
          shape: undefined,
          normal: l[i].normal.add(l[j].normal).normalize().round(),
        });
        aux = remake_intersections(aux, error);
      }
    }
  }
  return aux;
}
export function intersect_line(_l, o, range) {
  //intersections
  let intersects = [];
  for (let i of o) {
    if (i instanceof Line) {
      let p = intersect_line_line(_l, i, range);
      if (p) intersects.push(p);
    }
    if (i instanceof Rect) {
      intersects.push(...intersect_line_rect(_l, i, range));
    }
    if (i instanceof Circle) {
      intersects.push(...intersect_circle_line(_l, i, range));
    }
  }
  intersects = remake_intersections(intersects, 0.5);
  return intersects;
}
