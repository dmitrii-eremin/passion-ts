# Rect — Rectangle Utility API Reference

The `Rect` class in Passion's standard library provides a simple, type-safe, and expressive way to represent and manipulate rectangles in 2D space. It is designed for use in games and graphical applications, where rectangles are fundamental for collision detection, rendering, layout, and more. The API is minimal yet powerful, supporting both direct construction and convenient static helpers.

---

## Overview

A `Rect` object encapsulates a rectangle defined by its `left`, `top`, `width`, and `height` properties. This class is used throughout the engine for bounding boxes, hitboxes, viewport calculations, and more.

---

## API Reference

### Class: `Rect`

#### Properties
- `left: number` — The x coordinate of the left edge of the rectangle.
- `top: number` — The y coordinate of the top edge of the rectangle.
- `width: number` — The width of the rectangle.
- `height: number` — The height of the rectangle.
- `right: number` — The x coordinate of the right edge (read-only).
- `bottom: number` — The y coordinate of the bottom edge (read-only).

#### Constructor
```typescript
constructor(left: number = 0, top: number = 0, width: number = 0, height: number = 0)
```
- **left**: `number` *(optional)* — The x coordinate of the left edge. Defaults to `0`.
- **top**: `number` *(optional)* — The y coordinate of the top edge. Defaults to `0`.
- **width**: `number` *(optional)* — The width of the rectangle. Defaults to `0`.
- **height**: `number` *(optional)* — The height of the rectangle. Defaults to `0`.
- **returns**: `Rect` — A new Rect instance.

#### Instance Accessors

##### `right: number`
Returns the x coordinate of the right edge (`left + width`).
- **returns**: `number` — The right edge x coordinate.

##### `bottom: number`
Returns the y coordinate of the bottom edge (`top + height`).
- **returns**: `number` — The bottom edge y coordinate.

#### Static Methods

##### `fromCoords(left: number, top: number, width: number, height: number): Rect`
Creates a new `Rect` instance from coordinates and size.
- **left**: `number` — The x coordinate of the left edge.
- **top**: `number` — The y coordinate of the top edge.
- **width**: `number` — The width of the rectangle.
- **height**: `number` — The height of the rectangle.
- **returns**: `Rect` — A new Rect with the given properties.

##### `fromRect(rect: Rect): Rect`
Creates a new `Rect` instance from another `Rect`.
- **rect**: `Rect` — The source rectangle.
- **returns**: `Rect` — A new Rect with the same properties.

---

## Example Usage

```typescript
// Create a rectangle at (10, 20) with size 100x50
const r1: Rect = new Rect(10, 20, 100, 50);

// Access rectangle properties
const x: number = r1.left;
const y: number = r1.top;
const w: number = r1.width;
const h: number = r1.height;

// Get the right and bottom edges
const right: number = r1.right;
const bottom: number = r1.bottom;

// Copy an existing rectangle
const r2: Rect = Rect.fromRect(r1);

// Create a rectangle from coordinates
const r3: Rect = Rect.fromCoords(5, 15, 20, 30);

// Use rectangle for collision or drawing
if (mouse.x >= r1.left && mouse.x <= r1.right && mouse.y >= r1.top && mouse.y <= r1.bottom) {
    // Mouse is inside the rectangle
}
```

---

## Design Philosophy

- **Simplicity**: Minimal API for clarity and ease of use.
- **Type-Safe**: All parameters and return values are fully typed.
- **Reusable**: Designed for use throughout the engine and user code.

---

For more details on using rectangles with other subsystems, see the [Passion engine documentation](../index.md).
