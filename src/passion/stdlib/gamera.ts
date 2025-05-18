// Ported from gamera.lua v1.0.1 by Enrique García Cota
// TypeScript port by [Your Name], 2025
// License: MIT (see original Lua file)

// Utility functions
function clamp(x: number, minX: number, maxX: number): number {
  return x < minX ? minX : (x > maxX ? maxX : x);
}

function checkNumber(value: any, name: string): void {
  if (typeof value !== 'number') {
    throw new Error(`${name} must be a number (was: ${value})`);
  }
}

function checkPositiveNumber(value: any, name: string): void {
  if (typeof value !== 'number' || value <= 0) {
    throw new Error(`${name} must be a positive number (was: ${value})`);
  }
}

function checkAABB(l: number, t: number, w: number, h: number): void {
  checkNumber(l, 'l');
  checkNumber(t, 't');
  checkPositiveNumber(w, 'w');
  checkPositiveNumber(h, 'h');
}

function abs(x: number): number { return Math.abs(x); }
function min(a: number, b: number): number { return Math.min(a, b); }
function max(a: number, b: number): number { return Math.max(a, b); }

function getVisibleArea(self: Gamera, scale?: number): [number, number] {
  scale = scale ?? self.scale;
  const sin = abs(self.sin), cos = abs(self.cos);
  let w = self.w / scale, h = self.h / scale;
  w = cos * w + sin * h;
  h = sin * w + cos * h;
  return [min(w, self.ww), min(h, self.wh)];
}

function cornerTransform(self: Gamera, x: number, y: number): [number, number] {
  const scale = self.scale, sin = self.sin, cos = self.cos;
  x = x - self.x;
  y = y - self.y;
  const tx = -cos * x + sin * y;
  const ty = -sin * x - cos * y;
  return [self.x - (tx / scale + self.l), self.y - (ty / scale + self.t)];
}

function adjustPosition(self: Gamera): void {
  const wl = self.wl, wt = self.wt, ww = self.ww, wh = self.wh;
  const [w, h] = getVisibleArea(self);
  const w2 = w * 0.5, h2 = h * 0.5;
  const left = wl + w2, right = wl + ww - w2;
  const top = wt + h2, bottom = wt + wh - h2;
  self.x = clamp(self.x, left, right);
  self.y = clamp(self.y, top, bottom);
}

function adjustScale(self: Gamera): void {
  const ww = self.ww, wh = self.wh;
  const [rw, rh] = getVisibleArea(self, 1);
  const sx = rw / ww, sy = rh / wh;
  const rscale = max(sx, sy);
  self.scale = max(self.scale, rscale);
}

export class Gamera {
  x: number = 0;
  y: number = 0;
  scale: number = 1;
  angle: number = 0;
  sin: number = 0;
  cos: number = 1;
  l: number = 0;
  t: number = 0;
  w: number;
  h: number;
  w2: number;
  h2: number;
  wl: number = 0;
  wt: number = 0;
  ww: number = 0;
  wh: number = 0;

  constructor(l: number, t: number, w: number, h: number, sw: number, sh: number) {
    this.w = sw;
    this.h = sh;
    this.w2 = sw * 0.5;
    this.h2 = sh * 0.5;
    this.setWorld(l, t, w, h);
  }

  static new(l: number, t: number, w: number, h: number, sw: number, sh: number): Gamera {
    return new Gamera(l, t, w, h, sw, sh);
  }

  setWorld(l: number, t: number, w: number, h: number): void {
    checkAABB(l, t, w, h);
    this.wl = l;
    this.wt = t;
    this.ww = w;
    this.wh = h;
    adjustPosition(this);
  }

  setWindow(l: number, t: number, w: number, h: number): void {
    checkAABB(l, t, w, h);
    this.l = l;
    this.t = t;
    this.w = w;
    this.h = h;
    this.w2 = w * 0.5;
    this.h2 = h * 0.5;
    adjustPosition(this);
  }

  setPosition(x: number, y: number): void {
    checkNumber(x, 'x');
    checkNumber(y, 'y');
    this.x = x;
    this.y = y;
    adjustPosition(this);
  }

  setScale(scale: number): void {
    checkNumber(scale, 'scale');
    this.scale = scale;
    adjustScale(this);
    adjustPosition(this);
  }

  setAngle(angle: number): void {
    checkNumber(angle, 'angle');
    this.angle = angle;
    this.cos = Math.cos(angle);
    this.sin = Math.sin(angle);
    adjustScale(this);
    adjustPosition(this);
  }

  getWorld(): [number, number, number, number] {
    return [this.wl, this.wt, this.ww, this.wh];
  }

  getWindow(): [number, number, number, number] {
    return [this.l, this.t, this.w, this.h];
  }

  getPosition(): [number, number] {
    return [this.x, this.y];
  }

  getScale(): number {
    return this.scale;
  }

  getAngle(): number {
    return this.angle;
  }

  getVisible(): [number, number, number, number] {
    const [w, h] = getVisibleArea(this);
    return [this.x - w * 0.5, this.y - h * 0.5, w, h];
  }

  getVisibleCorners(): [number, number, number, number, number, number, number, number] {
    const x = this.x, y = this.y, w2 = this.w2, h2 = this.h2;
    const [x1, y1] = cornerTransform(this, x - w2, y - h2);
    const [x2, y2] = cornerTransform(this, x + w2, y - h2);
    const [x3, y3] = cornerTransform(this, x + w2, y + h2);
    const [x4, y4] = cornerTransform(this, x - w2, y + h2);
    return [x1, y1, x2, y2, x3, y3, x4, y4];
  }

  public get cameraX() {
    return this.x;
  }

  public get cameraY() {
    return this.y;
  }

//   function gamera:draw(f)
//   love.graphics.setScissor(self:getWindow())

//   love.graphics.push()
//     local scale = self.scale
//     love.graphics.scale(scale)

//     love.graphics.translate((self.w2 + self.l) / scale, (self.h2+self.t) / scale)
//     love.graphics.rotate(-self.angle)
//     love.graphics.translate(-self.x, -self.y)

//     f(self:getVisible())

//   love.graphics.pop()

//   love.graphics.setScissor()
// end

  // The draw method is not implemented, as it depends on the graphics API (e.g., love2d)
  // You can implement it for your rendering system as needed.

  toWorld(x: number, y: number): [number, number] {
    const scale = this.scale, sin = this.sin, cos = this.cos;
    let tx = (x - this.w2 - this.l) / scale;
    let ty = (y - this.h2 - this.t) / scale;
    const wx = cos * tx - sin * ty;
    const wy = sin * tx + cos * ty;
    return [wx + this.x, wy + this.y];
  }

  toScreen(x: number, y: number): [number, number] {
    const scale = this.scale, sin = this.sin, cos = this.cos;
    let tx = x - this.x;
    let ty = y - this.y;
    const sx = cos * tx + sin * ty;
    const sy = -sin * tx + cos * ty;
    return [scale * sx + this.w2 + this.l, scale * sy + this.h2 + this.t];
  }
}

export default Gamera;
