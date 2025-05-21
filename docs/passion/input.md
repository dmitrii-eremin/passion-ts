# IInput — Input Handling API Reference

The `IInput` interface provides a unified, type-safe, and expressive API for handling all user input in Passion games. It supports keyboard, mouse, and touch input, making it easy to build interactive and cross-platform experiences. The input subsystem abstracts away browser quirks and event management, giving you a clean and consistent way to query input state every frame.

---

## Overview

The input API is designed for real-time games, where you need to check the state of keys, mouse buttons, and touch points every frame. It tracks button presses, releases, and repeats, as well as pointer positions and wheel movement, so you can respond instantly to user actions.

---

## API Reference

See [Key values and button names](./keys.md) for a full list of supported keys and button identifiers.

### Interface: `IInput`

#### Properties

- `mouse_x: number` *(readonly)*
  - The current x coordinate of the mouse pointer, relative to the canvas.
- `mouse_y: number` *(readonly)*
  - The current y coordinate of the mouse pointer, relative to the canvas.
- `mouse_wheel_x: number` *(readonly)*
  - The horizontal scroll amount since the last frame.
- `mouse_wheel_y: number` *(readonly)*
  - The vertical scroll amount since the last frame.
- `touch_x: number[]` *(readonly)*
  - The x coordinates of all active touch points.
- `touch_y: number[]` *(readonly)*
  - The y coordinates of all active touch points.

#### Methods

##### `mouse(visible: boolean): void`
Shows or hides the mouse cursor over the game canvas.
- **visible**: `boolean` — `true` to show the cursor, `false` to hide it.
- **returns**: `void`

##### `btn(key: Key): boolean`
Checks if a key or button is currently held down.
- **key**: `Key` — The key or button to check (e.g., `'ArrowLeft'`, `'MouseButtonLeft'`, `'Touch0'`).
- **returns**: `boolean` — `true` if the key is held, `false` otherwise.

##### `btnr(key: Key): boolean`
Checks if a key or button was released since the last frame.
- **key**: `Key` — The key or button to check.
- **returns**: `boolean` — `true` if the key was released, `false` otherwise.

##### `btnp(key: Key, hold?: number, repeat?: number): boolean`
Checks if a key or button was pressed this frame, or implements custom hold/repeat logic.
- **key**: `Key` — The key or button to check.
- **hold**: `number` *(optional)* — The number of frames the key must be held before triggering. Defaults to `1`.
- **repeat**: `number` *(optional)* — The repeat interval in frames. If set, returns `true` every `repeat` frames after `hold` is reached.
- **returns**: `boolean` — `true` if the key was pressed or repeated, `false` otherwise.

---

## Example Usage

### Keyboard and Mouse Input
```typescript
// Hide the mouse cursor
passion.input.mouse(false);

// Check if the spacebar is held
enum MyKey {
    Space = 'Space',
}
const isSpaceHeld: boolean = passion.input.btn(MyKey.Space);

// Check if the left mouse button was just pressed
const isMousePressed: boolean = passion.input.btnp('MouseButtonLeft');

// Get mouse position
const mx: number = passion.input.mouse_x;
const my: number = passion.input.mouse_y;
```

### Touch Input
```typescript
// Get the first touch point
const tx: number = passion.input.touch_x[0];
const ty: number = passion.input.touch_y[0];

// Check if the first touch is active
const isTouchActive: boolean = passion.input.btn('Touch0');
```

---

## Design Philosophy

- **Unified**: One API for keyboard, mouse, and touch.
- **Type-Safe**: All parameters and return values are fully typed.
- **Frame-Based**: Designed for real-time polling in the game loop.
- **Cross-Platform**: Works seamlessly on desktop and mobile browsers.

---

For more details on integrating the input API with other subsystems, see the [Passion engine documentation](./passion.md).
