// Bump-like 2D AABB collision system for TypeScript
// Ported from bump.lua (https://github.com/kikito/bump.lua)

export type Rect = { x: number; y: number; w: number; h: number };

export type Item = object;

export interface Collision {
  item: Item;
  other: Item;
  type: string;
  overlaps: boolean;
  ti: number;
  move: { x: number; y: number };
  normal: { x: number; y: number };
  touch: { x: number; y: number };
  itemRect: Rect;
  otherRect: Rect;
}

export class World {
  private items: Map<Item, Rect> = new Map();

  add(item: Item, x: number, y: number, w: number, h: number): void {
    this.items.set(item, { x, y, w, h });
  }

  remove(item: Item): void {
    this.items.delete(item);
  }

  getRect(item: Item): Rect | undefined {
    return this.items.get(item);
  }

  move(item: Item, x: number, y: number, w?: number, h?: number): { x: number; y: number; collisions: Collision[] } {
    // Basic move: update position, check for collisions
    const rect = this.items.get(item);
    if (!rect) return { x, y, collisions: [] };
    const newRect = { x, y, w: w ?? rect.w, h: h ?? rect.h };
    const collisions: Collision[] = [];
    for (const [other, otherRect] of this.items.entries()) {
      if (other === item) continue;
      if (this.aabbCheck(newRect, otherRect)) {
        collisions.push({
          item,
          other,
          type: 'touch',
          overlaps: true,
          ti: 1,
          move: { x, y },
          normal: { x: 0, y: 0 },
          touch: { x, y },
          itemRect: newRect,
          otherRect,
        });
      }
    }
    this.items.set(item, newRect);
    return { x: newRect.x, y: newRect.y, collisions };
  }

  queryRect(x: number, y: number, w: number, h: number): Item[] {
    const found: Item[] = [];
    for (const [item, rect] of this.items.entries()) {
      if (this.aabbCheck(rect, { x, y, w, h })) {
        found.push(item);
      }
    }
    return found;
  }

  update(item: Item, x: number, y: number, w?: number, h?: number): void {
    const rect = this.items.get(item);
    if (!rect) return;
    this.items.set(item, { x, y, w: w ?? rect.w, h: h ?? rect.h });
  }

  // Move with collision response (slide, touch, cross, bounce)
  moveWithCollisions(
    item: Item,
    goalX: number,
    goalY: number,
    response: 'slide' | 'touch' | 'cross' | 'bounce' = 'slide'
  ): { x: number; y: number; collisions: Collision[] } {
    const rect = this.items.get(item);
    if (!rect) return { x: goalX, y: goalY, collisions: [] };
    let x = rect.x, y = rect.y;
    let dx = goalX - x, dy = goalY - y;
    let collisions: Collision[] = [];
    let finalX = goalX, finalY = goalY;
    // Sweep: check for earliest collision
    let minTi = 1;
    let hit: Collision | null = null;
    for (const [other, otherRect] of this.items.entries()) {
      if (other === item) continue;
      const col = this.sweepAABB(rect, otherRect, dx, dy);
      if (col && col.ti < minTi) {
        minTi = col.ti;
        hit = {
          item,
          other,
          type: col.type ?? 'slide',
          overlaps: col.overlaps ?? false,
          ti: col.ti,
          move: col.move ?? { x: dx, y: dy },
          normal: col.normal,
          touch: col.touch,
          itemRect: rect,
          otherRect
        };
      }
    }
    if (hit) {
      // Apply response
      if (response === 'slide') {
        finalX = x + dx * hit.ti;
        finalY = y + dy * hit.ti;
        // Slide along the normal
        if (hit.normal.x !== 0) dx = 0;
        if (hit.normal.y !== 0) dy = 0;
      } else if (response === 'touch') {
        finalX = x + dx * hit.ti;
        finalY = y + dy * hit.ti;
        dx = 0; dy = 0;
      } else if (response === 'cross') {
        // Ignore collision
        finalX = goalX; finalY = goalY;
      } else if (response === 'bounce') {
        finalX = x + dx * hit.ti;
        finalY = y + dy * hit.ti;
        dx = hit.normal.x !== 0 ? -dx : dx;
        dy = hit.normal.y !== 0 ? -dy : dy;
      }
      collisions.push(hit);
    }
    this.items.set(item, { x: finalX, y: finalY, w: rect.w, h: rect.h });
    return { x: finalX, y: finalY, collisions };
  }

  // Query for items containing a point
  queryPoint(x: number, y: number): Item[] {
    const found: Item[] = [];
    for (const [item, rect] of this.items.entries()) {
      if (x >= rect.x && x < rect.x + rect.w && y >= rect.y && y < rect.y + rect.h) {
        found.push(item);
      }
    }
    return found;
  }

  // Query for items intersecting a segment
  querySegment(x1: number, y1: number, x2: number, y2: number): Item[] {
    const found: Item[] = [];
    for (const [item, rect] of this.items.entries()) {
      if (this.segmentAABB(x1, y1, x2, y2, rect)) {
        found.push(item);
      }
    }
    return found;
  }

  // --- Internal helpers ---
  private aabbCheck(a: Rect, b: Rect): boolean {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  private sweepAABB(a: Rect, b: Rect, dx: number, dy: number): Partial<Collision> & { ti: number; normal: { x: number; y: number }; touch: { x: number; y: number } } | null {
    // 1. Check for initial overlap
    if (this.aabbCheck(a, b)) {
      return {
        ti: 0,
        normal: { x: 0, y: 0 },
        touch: { x: a.x, y: a.y },
        overlaps: true,
        type: 'overlap',
        move: { x: dx, y: dy },
      };
    }
    // 2. Swept AABB collision detection (returns earliest collision info or null)
    let xInvEntry, yInvEntry, xInvExit, yInvExit;
    if (dx > 0) {
      xInvEntry = b.x - (a.x + a.w);
      xInvExit = (b.x + b.w) - a.x;
    } else {
      xInvEntry = (b.x + b.w) - a.x;
      xInvExit = b.x - (a.x + a.w);
    }
    if (dy > 0) {
      yInvEntry = b.y - (a.y + a.h);
      yInvExit = (b.y + b.h) - a.y;
    } else {
      yInvEntry = (b.y + b.h) - a.y;
      yInvExit = b.y - (a.y + a.h);
    }
    const xEntry = dx === 0 ? -Infinity : xInvEntry / dx;
    const xExit = dx === 0 ? Infinity : xInvExit / dx;
    const yEntry = dy === 0 ? -Infinity : yInvEntry / dy;
    const yExit = dy === 0 ? Infinity : yInvExit / dy;
    const entryTime = Math.max(xEntry, yEntry);
    const exitTime = Math.min(xExit, yExit);
    // 3. Only allow collisions if entryTime is within [0,1] and entryTime <= exitTime
    if (
      entryTime > exitTime ||
      xEntry < 0 && yEntry < 0 ||
      entryTime < 0 ||
      entryTime > 1
    ) {
      return null;
    }
    // 4. Set normal based on which axis was hit first
    let normal = { x: 0, y: 0 };
    if (xEntry > yEntry) {
      normal.x = xInvEntry < 0 ? 1 : -1;
    } else {
      normal.y = yInvEntry < 0 ? 1 : -1;
    }
    return {
      ti: entryTime,
      normal,
      touch: { x: a.x + dx * entryTime, y: a.y + dy * entryTime },
      overlaps: false,
      type: 'slide',
      move: { x: dx, y: dy },
    };
  }

  private segmentAABB(x1: number, y1: number, x2: number, y2: number, rect: Rect): boolean {
    // Liang-Barsky algorithm for segment-AABB intersection
    let t0 = 0, t1 = 1;
    const dx = x2 - x1, dy = y2 - y1;
    const p = [-dx, dx, -dy, dy];
    const q = [x1 - rect.x, rect.x + rect.w - x1, y1 - rect.y, rect.y + rect.h - y1];
    for (let i = 0; i < 4; i++) {
      if (p[i] === 0) {
        if (q[i] < 0) return false;
      } else {
        const r = q[i] / p[i];
        if (p[i] < 0) {
          if (r > t1) return false;
          if (r > t0) t0 = r;
        } else {
          if (r < t0) return false;
          if (r < t1) t1 = r;
        }
      }
    }
    return true;
  }
}
