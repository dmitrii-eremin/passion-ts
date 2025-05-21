# Key — Input Key Reference

The `Key` type in Passion defines all possible keyboard, mouse, and touch input values that can be used with the input subsystem. This comprehensive union type allows you to write type-safe code for any supported input, including standard keyboard keys, mouse buttons, and up to 10 simultaneous touch points.

---

## Key Values

### Touch Keys
- `'Touch0'` ... `'Touch9'` — Touch points 0 through 9. Used for multi-touch input on mobile devices.

### Mouse Buttons
- `'MouseButtonLeft'` — Left mouse button.
- `'MouseButtonMiddle'` — Middle mouse button (usually the scroll wheel button).
- `'MouseButtonRight'` — Right mouse button.

### Modifier Keys
- `'AltLeft'`, `'AltRight'` — Left and right Alt keys.
- `'ControlLeft'`, `'ControlRight'` — Left and right Control keys.
- `'ShiftLeft'`, `'ShiftRight'` — Left and right Shift keys.
- `'CapsLock'` — Caps Lock key.
- `'NumLock'` — Num Lock key.

### Arrow Keys
- `'ArrowUp'`, `'ArrowDown'`, `'ArrowLeft'`, `'ArrowRight'` — Arrow keys for navigation.

### Function Keys
- `'F1'` ... `'F20'` — Function keys F1 through F20.

### Number Row
- `'Digit0'` ... `'Digit9'` — Number keys 0 through 9 at the top of the keyboard.

### Numpad Keys
- `'Numpad0'` ... `'Numpad9'` — Numeric keypad keys 0 through 9.
- `'NumpadAdd'` — Numpad plus (+).
- `'NumpadSubtract'` — Numpad minus (-).
- `'NumpadMultiply'` — Numpad multiply (*).
- `'NumpadDivide'` — Numpad divide (/).
- `'NumpadDecimal'` — Numpad decimal point (.).
- `'NumpadEnter'` — Numpad Enter key.
- `'NumpadEqual'` — Numpad equals (=).
- `'NumpadComma'` — Numpad comma (,).

### Navigation and Editing
- `'Home'`, `'End'`, `'PageUp'`, `'PageDown'` — Navigation keys.
- `'Insert'`, `'Delete'`, `'Backspace'` — Editing keys.
- `'Enter'` — Enter/Return key.
- `'Tab'` — Tab key.
- `'Escape'` — Escape key.

### Punctuation and Symbols
- `'Backquote'` — Backtick (`) key.
- `'Minus'` — Minus (-) key.
- `'Equal'` — Equal (=) key.
- `'BracketLeft'`, `'BracketRight'` — Left and right square brackets ([, ]).
- `'Backslash'` — Backslash (\) key.
- `'Semicolon'` — Semicolon (;) key.
- `'Quote'` — Quote (') key.
- `'Comma'` — Comma (,) key.
- `'Period'` — Period (.) key.
- `'Slash'` — Slash (/) key.

### Letters
- `'KeyA'` ... `'KeyZ'` — Letter keys A through Z.

### International and Language Keys
- `'ContextMenu'` — Context menu key (usually next to right Ctrl).
- `'IntlBackslash'`, `'IntlRo'`, `'IntlYen'` — International keys for various layouts.
- `'Lang1'`, `'Lang2'` — Language-specific keys.

### Space and Miscellaneous
- `'Space'` — Spacebar.

---

## Usage Example

```typescript
// Check if the left arrow key is held
enum MyKey {
    Left = 'ArrowLeft',
}
const isLeftHeld: boolean = passion.input.btn(MyKey.Left);

// Check if the first touch point is active
const isTouchActive: boolean = passion.input.btn('Touch0');

// Check if the spacebar was just pressed
const isSpacePressed: boolean = passion.input.btnp('Space');
```

---

## Notes
- All key values correspond to the standard [KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) values, mouse button names, or touch indices.
- Use these values with the input API for type-safe, cross-platform input handling.

For more details on input handling, see the [input API documentation](./input.md).
