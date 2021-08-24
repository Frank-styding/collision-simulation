import { Vec2 } from "./math/Vec2.js";
import { round } from "./math/Utilities.js";
import { Circle, Line, Rect, Particle } from "./Shapes/Shapes.js";
import { intersect_line, OUT_IN_POSITIVE } from "./Intersections.js";
//canvas
/**@type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = innerWidth - 120;
const height = innerHeight;
canvas.width = width;
canvas.height = height;

//elements
let particles = [new Particle(90, 90, new Vec2(-0.5, 1).normalize().mul(7))];
let shapes = [new Rect(0, 0, width, height)];
let points = [];
let points_draw = [];

//mouse
let mouse_pos = { x: 0, y: 0, down: false };
canvas.onmousemove = (e) => {
  mouse_pos.x = e.clientX;
  mouse_pos.y = e.clientY;
};
canvas.onmousedown = (e) => {
  mouse_pos.down = true;
};
canvas.onmouseup = (e) => {
  mouse_pos.down = false;
};

//keys
let keys = {};
onkeydown = (e) => {
  keys[e.keyCode] = true;
};
onkeyup = (e) => {
  delete keys[e.keyCode];
};

//buttons
const btn_rect = document.getElementById("btn-rect");
const btn_line = document.getElementById("btn-line");
const btn_circle = document.getElementById("btn-circle");
const btn_particle = document.getElementById("btn-particle");
const btn_play = document.getElementById("btn-play");
const btn_stop = document.getElementById("btn-stop");
const btn_clear = document.getElementById("btn-clear");
//stop-play
let run = false;
btn_play.onmousedown = () => (run = true);
btn_stop.onmousedown = () => (run = false);
//
let current_shape = "";
btn_rect.onmousedown = () => (current_shape = "rect");
btn_circle.onmousedown = () => (current_shape = "circle");
btn_line.onmousedown = () => (current_shape = "line");
btn_particle.onmousedown = () => (current_shape = "particle");
btn_clear.onmousedown = () => {
  shapes = [];
  points = [];
  particles = [];
};
/**
 *
 * @param {{x:number,y:number}[]} l
 * @param {{x:number,y:number}} p
 */
function near_point(l, p) {
  let c_d = Number.MAX_VALUE;
  let c_i = null;
  for (let i of l) {
    let d = round((i.x - p.x) * (i.x - p.x) + (i.y - p.y) * (i.y - p.y));
    if (d <= c_d) {
      c_d = d;
      c_i = i;
    }
  }
  if (c_i != null) return { ...c_i, d_sqrt: c_d };
  return;
}
/**
 * @param {Particle} particle
 * @param {Rect|Line|Circle} shapes
 */
function calc_dir(p, shapes) {
  const range = p.dir_length;

  let ray = {
    x1: p.x + p.dir.x,
    y1: p.y + p.dir.y,
    x2: p.x,
    y2: p.y,
  };
  let i = near_point(
    intersect_line(ray, shapes, OUT_IN_POSITIVE).filter(
      (item) => item.x != p.x && item.y != p.y,
    ),
    p,
  );
  if (i&& c_i_p != i) {
    if (i.d_sqrt < range) {
    
      p.x = round(i.x);
      p.y = round(i.y);
      let dir = Vec2.reflec(p.dir.copy(), i.normal);
      p.dir = dir;
      c_i_p = i;
      
      debugger;
    }
  }

  return p;
}

function detect_points(ctx) {
  if (points.length == 1 && current_shape != "") {
    new Circle(mouse_pos.x, mouse_pos.y, 2, true).draw(ctx);
    if (current_shape == "line") {
      new Line([points[0].x, points[0].y], [mouse_pos.x, mouse_pos.y]).draw(
        ctx,
      );
    }
    if (current_shape == "circle") {
      new Circle(
        points[0].x,
        points[0].y,
        Math.sqrt(
          (points[0].x - mouse_pos.x) ** 2 + (points[0].y - mouse_pos.y) ** 2,
        ),
      ).draw(ctx);
    }
    if (current_shape == "rect") {
      let d_x = Math.abs(points[0].x - mouse_pos.x);
      let d_y = Math.abs(points[0].y - mouse_pos.y);

      new Rect(points[0].x - d_x, points[0].y - d_y, d_x * 2, d_y * 2).draw(
        ctx,
      );
    }
    if (current_shape == "particle") {
      new Particle(
        points[0].x,
        points[0].y,
        new Vec2(mouse_pos.x - points[0].x, mouse_pos.y - points[0].y).div(5),
      ).draw(ctx);
    }
  }
  if (mouse_pos.down && current_shape != "") {
    if (
      points.filter((item) => item.x == mouse_pos.x && item.y == mouse_pos.y)
        .length == 0
    ) {
      points.push({ x: mouse_pos.x, y: mouse_pos.y });

      points_draw.push(new Circle(mouse_pos.x, mouse_pos.y, 2, true));
    }

    if (points.length == 2) {
      if (current_shape == "line") {
        shapes.push(
          new Line([points[0].x, points[0].y], [points[1].x, points[1].y]),
        );
      }
      if (current_shape == "circle") {
        shapes.push(
          new Circle(
            points[0].x,
            points[0].y,
            Math.sqrt(
              (points[0].x - points[1].x) ** 2 +
                (points[0].y - points[1].y) ** 2,
            ),
          ),
        );
      }
      if (current_shape == "rect") {
        let d_x = Math.abs(points[0].x - points[1].x);
        let d_y = Math.abs(points[0].y - points[1].y);
        shapes.push(
          new Rect(points[0].x - d_x, points[0].y - d_y, d_x * 2, d_y * 2),
        );
      }
      if (current_shape == "particle") {
        particles.push(
          new Particle(
            points[0].x,
            points[0].y,
            new Vec2(points[1].x - points[0].x, points[1].y - points[0].y).div(
              5,
            ),
          ),
        );
        points_draw.pop();
        points_draw.pop();
      }
      current_shape = "";
      points = [];
    }
  }
  points_draw.forEach((item) => item.draw(ctx));
}
let lastTime = 0;
let currentTime;
let c_i_p = null;
function animate(time = 0) {
  ctx.clearRect(0, 0, width, height);

  //console.log(width / 2 - particles[0].x, height / 2 - particles[0].y);
  //time;
  currentTime = time - lastTime;
  lastTime = time;
  ctx.save();

  detect_points(ctx);
  //update
  if (run) {
    for (let i = 0; i < particles.length; i++) {
      particles[i] = calc_dir(particles[i].copy(), shapes);
      particles[i] = calc_dir(particles[i].copy(), shapes);
    }

    particles.forEach((item) => item.update(currentTime));
  }
  //draw

  [...particles, ...shapes].forEach((item) => item.draw(ctx));
  ctx.restore();
  requestAnimationFrame(animate);
}
animate();
