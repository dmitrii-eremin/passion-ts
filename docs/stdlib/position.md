# Position — 2D Position Utility API Reference

The `Position` class in Passion's standard library provides a simple, type-safe, and expressive way to represent and manipulate 2D coordinates. It is designed for use in games and graphical applications, where positions are a fundamental concept for movement, collision, rendering, and more. The API is minimal yet powerful, supporting both direct construction and convenient static helpers.

---

## Overview

A `Position` object encapsulates an `x` and `y` coordinate, representing a point in 2D space. This class is used throughout the engine for mouse/touch input, sprite placement, camera movement, and more.

---

## API Reference

### Class: `Position`

#### Properties
- `x: number` — The x coordinate.
- `y: number` — The y coordinate.

#### Constructor
```typescript
constructor(x: number = 0, y: number = 0)
```
- **x**: `number` *(optional)* — The x coordinate. Defaults to `0`.
- **y**: `number` *(optional)* — The y coordinate. Defaults to `0`.
- **returns**: `Position` — A new Position instance.

#### Static Methods

##### `fromPosition(pos: Position): Position`
Creates a new `Position` instance from another `Position`.
- **pos**: `Position` — The source position.
- **returns**: `Position` — A new Position with the same coordinates.

##### `fromCoords(x: number, y: number): Position`
Creates a new `Position` instance from x and y coordinates.
- **x**: `number` — The x coordinate.
- **y**: `number` — The y coordinate.
- **returns**: `Position` — A new Position with the given coordinates.

---

## Example Usage

```typescript
// Create a position at (10, 20)
const p1: Position = new Position(10, 20);

// Copy an existing position
const p2: Position = Position.fromPosition(p1);

// Create a position from coordinates
const p3: Position = Position.fromCoords(5, 15);

// Access coordinates
drawSprite(p1.x, p1.y);
```

---

## Design Philosophy

- **Simplicity**: Minimal API for clarity and ease of use.
- **Type-Safe**: All parameters and return values are fully typed.
- **Reusable**: Designed for use throughout the engine and user code.

---

For more details on using positions with other subsystems, see the [Passion engine documentation](../index.md).
