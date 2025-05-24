# ICamera — Camera Interface API Reference

The `ICamera` interface in Passion's standard library defines a type-safe, expressive contract for 2D camera systems. It is designed for use in games and graphical applications, where camera movement, viewport control, and world navigation are essential. The API is minimal yet powerful, supporting smooth camera movement, world and window management, and flexible drawing callbacks.

---

## Overview

An `ICamera` object represents a virtual camera in 2D space, controlling what part of the world is visible on the screen. It provides properties for position and target, as well as methods for updating, drawing, and configuring the camera's world and window.

---

## API Reference

### Interface: `ICamera`

#### Properties (Read-only)
- `x: number` — The current x coordinate of the camera's position.
- `y: number` — The current y coordinate of the camera's position.
- `targetX: number` — The target x coordinate the camera is moving towards.
- `targetY: number` — The target y coordinate the camera is moving towards.
- `offsetX: number` — The x offset applied to the camera (for rendering).
- `offsetY: number` — The y offset applied to the camera (for rendering).

#### Methods

##### `update(dt: number): void`
Updates the camera's position based on the elapsed time and its target position.
- **dt**: `number` — The delta time since the last update (in seconds).

##### `draw(callback: CameraDrawCallback): void`
Applies the camera transformation and invokes a drawing callback.
- **callback**: `(left: number, top: number, width: number, height: number) => void` — The function to call for drawing within the camera's view.

##### `setWorld(left: number, top: number, width: number, height: number): void`
Sets the boundaries of the world the camera can move within. If the function is called without parameters, then the boundaries are unlimited.
- **left**: `number` — The x coordinate of the world's left edge.
- **top**: `number` — The y coordinate of the world's top edge.
- **width**: `number` — The width of the world.
- **height**: `number` — The height of the world.

##### `getWorld(): Rect`
Returns a copy of the current world rectangle.
- **returns**: `Rect` — The world boundaries.

##### `setWindow(left: number, top: number, width: number, height: number): void`
Sets the camera's viewport (window) on the screen.
- **left**: `number` — The x coordinate of the window's left edge.
- **top**: `number` — The y coordinate of the window's top edge.
- **width**: `number` — The width of the window.
- **height**: `number` — The height of the window.

##### `getWindow(): Rect`
Returns a copy of the current window rectangle.
- **returns**: `Rect` — The window boundaries.

##### `setSpeed(speed: number): void`
Sets the camera's movement speed.
- **speed**: `number` — The speed at which the camera moves towards its target.

##### `setPosition(x: number, y: number): void`
Sets the camera's current position immediately.
- **x**: `number` — The new x coordinate.
- **y**: `number` — The new y coordinate.

##### `moveTo(x: number, y: number): void`
Moves the camera smoothly towards a target position.
- **x**: `number` — The target x coordinate.
- **y**: `number` — The target y coordinate.

---

## Example Usage

```typescript
// Assume you have a Passion instance and a Camera implementation
const camera: ICamera = new Camera(passion);

// Set the world boundaries
camera.setWorld(0, 0, 2000, 2000);

// Set the camera window (viewport)
camera.setWindow(0, 0, 800, 600);

// Move the camera instantly to (100, 100)
camera.setPosition(100, 100);

// Smoothly move the camera to (500, 500)
camera.moveTo(500, 500);

// Update the camera each frame
camera.update(dt);

// Draw with camera transformation
camera.draw((left, top, width, height) => {
    // Render your scene here
});

// Access camera properties
const x = camera.x;
const y = camera.y;
const offsetX = camera.offsetX;
const offsetY = camera.offsetY;
```

---

## Design Philosophy

- **Simplicity**: Minimal API for clarity and ease of use.
- **Type-Safe**: All parameters and return values are fully typed.
- **Reusable**: Designed for use throughout the engine and user code.

---

For more details on using cameras with other subsystems, see the [Passion engine documentation](../index.md).
