# ISystem — System API Reference

The `ISystem` interface provides the core game loop, window, and timing management for Passion games. It is responsible for initializing the game window, managing frame updates, and orchestrating the main run loop that drives your game logic and rendering. This subsystem is the heart of every Passion project, ensuring smooth, consistent updates and drawing.

---

## Overview

The system API is designed to be simple yet powerful, giving you full control over the game lifecycle. It abstracts away browser-specific details and provides a clean, type-safe interface for starting and running your game.

---

## API Reference

### Interface: `ISystem`

#### Properties

- `width: number` — *(readonly)*
  - The current width of the game canvas, in pixels.
- `height: number` — *(readonly)*
  - The current height of the game canvas, in pixels.
- `frame_count: number` — *(readonly)*
  - The current frame count or frames per second (FPS), depending on implementation.

#### Methods

##### `init(width: number, height: number, title?: string, display_scale?: number): void`
Initializes the game window and sets up the canvas for rendering.

- **width**: `number` — The width of the canvas in pixels.
- **height**: `number` — The height of the canvas in pixels.
- **title**: `string` *(optional)* — The title of the browser window. Defaults to `'passion'`.
- **display_scale**: `number` *(optional)* — The display scale factor for rendering. Defaults to `1`.
- **returns**: `void`

##### `run(update: (dt: number) => void, draw: () => void): void`
Starts the main game loop, calling your update and draw functions every frame.

- **update**: `(dt: number) => void` — The update callback, called every frame with the delta time (in seconds) since the last frame.
- **draw**: `() => void` — The draw callback, called every frame after update.
- **returns**: `void`

---

## Example Usage

### Initializing and Running the Game Loop
```typescript
passion.system.init(256, 256, 'My Game', 2);

function update(dt: number): void {
    // Game logic here
}

function draw(): void {
    passion.graphics.cls(0); // Clear screen with color 0
    // Drawing code here
}

passion.system.run(update, draw);
```

---

## Design Philosophy

- **Simplicity**: Minimal API surface for maximum clarity.
- **Performance**: Uses `requestAnimationFrame` for smooth, efficient updates.
- **Type-Safe**: All parameters and return values are fully typed.
- **Browser-First**: Designed for modern web environments.

---

For more details on integrating the system API with other subsystems, see the [Passion engine documentation](./passion.md).
