# Size — 2D Size Utility API Reference

The `Size` class in Passion's standard library provides a simple, type-safe, and expressive way to represent and manipulate 2D sizes (width and height). It is designed for use in games and graphical applications, where sizes are a fundamental concept for layout, collision, rendering, and more. The API is minimal yet powerful, supporting both direct construction and convenient instance helpers.

---

## Overview

A `Size` object encapsulates a `width` and `height`, representing the dimensions of a 2D rectangle or area. This class is used throughout the engine for sprite sizes, viewport dimensions, collision boxes, and more.

---

## API Reference

### Class: `Size`

#### Properties
- `width: number` — The width component.
- `height: number` — The height component.

#### Constructor
```typescript
constructor(width: number = 0, height: number = 0)
```
- **width**: `number` *(optional)* — The width. Defaults to `0`.
- **height**: `number` *(optional)* — The height. Defaults to `0`.
- **returns**: `Size` — A new Size instance.

#### Instance Methods

##### `square(): number`
Returns the area (width × height) of the size.
- **returns**: `number` — The area of the size.

##### `clone(): Size`
Returns a new `Size` with the same width and height as this one.
- **returns**: `Size` — The cloned size.

---

## Example Usage

```typescript
// Create a size of 10x20
const s1: Size = new Size(10, 20);

// Get the area
const area: number = s1.square();

// Copy an existing size
const s2: Size = s1.clone();

// Access width and height
console.log(s1.width, s1.height);
```

---

## Design Philosophy

- **Simplicity**: Minimal API for clarity and ease of use.
- **Type-Safe**: All parameters and return values are fully typed.
- **Reusable**: Designed for use throughout the engine and user code.

---

For more details on using sizes with other subsystems, see the [Passion engine documentation](../index.md).
