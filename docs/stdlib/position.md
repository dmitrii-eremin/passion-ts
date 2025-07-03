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
- `length: number` — The distance from the origin to this position (read-only).

#### Constructor
```typescript
constructor(x: number = 0, y: number = 0)
```
- **x**: `number` *(optional)* — The x coordinate. Defaults to `0`.
- **y**: `number` *(optional)* — The y coordinate. Defaults to `0`.
- **returns**: `Position` — A new Position instance.

#### Instance Methods

##### `normalize(): Position`
Returns a new `Position` with the same direction but a length of 1 (unit vector). If the position is at the origin, returns (0, 0).
- **returns**: `Position` — The normalized position.

##### `add(other: Position): Position`
Returns a new `Position` that is the sum of this position and another.
- **other**: `Position` — The position to add.
- **returns**: `Position` — The resulting position.

##### `multiple(num: number): Position`
Returns a new `Position` scaled by the given number.
- **num**: `number` — The scale factor.
- **returns**: `Position` — The scaled position.

##### `apply(fn: (val: number) => number): Position`
Returns a new `Position` with the function `fn` applied to both x and y coordinates.
- **fn**: `(val: number) => number` — The function to apply to each coordinate.
- **returns**: `Position` — The resulting position.

##### `clone(): Position`
Returns a new `Position` with the same coordinates as this one.
- **returns**: `Position` — The cloned position.

##### `substract(other: Position): Position`
Returns a new `Position` that is the difference between this position and another.
- **other**: `Position` — The position to subtract.
- **returns**: `Position` — The resulting position.

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

##### `random(): Position`
Creates a new `Position` with random direction (unit vector).
- **returns**: `Position` — A random unit vector position.

---

## Example Usage

```typescript
// Create a position at (10, 20)
const p1: Position = new Position(10, 20);

// Get the length (distance from origin)
const len: number = p1.length;

// Copy an existing position
const p2: Position = Position.fromPosition(p1);

// Create a position from coordinates
const p3: Position = Position.fromCoords(5, 15);

// Normalize a position
const unit: Position = p1.normalize();

// Add two positions
const sum: Position = p1.add(p3);

// Scale a position
const scaled: Position = p1.multiple(2);

// Generate a random unit vector position
const randomPos: Position = Position.random();

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
