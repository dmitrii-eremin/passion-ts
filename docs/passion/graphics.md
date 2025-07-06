# IGraphics — Graphics API Reference

The `IGraphics` interface provides a comprehensive, type-safe, and highly expressive API for 2D graphics in Passion. It is the core of all drawing operations, enabling you to render shapes, images, text, and manage palettes with pixel-perfect precision. The graphics subsystem is designed for retro-style games, but is flexible enough for a wide range of visual effects and rendering techniques.

---

## Overview

The graphics API is built around a single HTMLCanvasElement and a palette-based color system. It supports a variety of drawing primitives, image blitting, text rendering, and palette manipulation, all with a focus on clarity and performance. All drawing is performed in software, giving you full control over every pixel.

---

## API Reference

### Interface: `IGraphics`

#### Properties

- `images: PassionImage[]` *(readonly)*
  - An array of all loaded images, for advanced use cases.

#### Methods

##### `camera(x?: number, y?: number): void`
Sets the camera (scroll) position for all subsequent drawing operations.
- **x**: `number` *(optional)* — The x offset. Defaults to `0`.
- **y**: `number` *(optional)* — The y offset. Defaults to `0`.
- **returns**: `void`

##### `clip(left?: number, top?: number, width?: number, height?: number): void`
Sets or resets the clipping rectangle for drawing. If all arguments are omitted, restores the previous clip.
- **left**: `number` *(optional)* — Left edge of the clip rectangle.
- **top**: `number` *(optional)* — Top edge of the clip rectangle.
- **width**: `number` *(optional)* — Width of the clip rectangle.
- **height**: `number` *(optional)* — Height of the clip rectangle.
- **returns**: `void`

##### `pal(colors?: string[]): void`
Sets the current color palette.
- **colors**: `string[]` *(optional)* — An array of color hex strings. If omitted, resets to the default palette.
- **returns**: `void`

##### `font(fontIndex?: FontIndex): void`
Sets the current font for text rendering.
- **fontIndex**: `FontIndex` *(optional)* — BDF font index loaded by passion.resource.loadFont. If omitted, uses the default font.
- **returns**: `void`

##### `cls(col: Color): void`
Clears the screen to the specified color.
- **col**: `Color` — The color index to use for clearing.
- **returns**: `void`

##### `pget(x: number, y: number): Color`
Gets the color at the specified pixel.
- **x**: `number` — The x coordinate.
- **y**: `number` — The y coordinate.
- **returns**: `Color` — The color index at the pixel.

##### `pset(x: number, y: number, col: Color): void`
Sets the color of a single pixel.
- **x**: `number` — The x coordinate.
- **y**: `number` — The y coordinate.
- **col**: `Color` — The color index to set.
- **returns**: `void`

##### `line(x1: number, y1: number, x2: number, y2: number, col: Color): void`
Draws a line between two points.
- **x1**: `number` — Start x.
- **y1**: `number` — Start y.
- **x2**: `number` — End x.
- **y2**: `number` — End y.
- **col**: `Color` — The color index.
- **returns**: `void`

##### `rect(x: number, y: number, w: number, h: number, col: Color): void`
Draws a filled rectangle.
- **x**: `number` — Top-left x.
- **y**: `number` — Top-left y.
- **w**: `number` — Width.
- **h**: `number` — Height.
- **col**: `Color` — The color index.
- **returns**: `void`

##### `rectb(x: number, y: number, w: number, h: number, col: Color): void`
Draws a rectangle border (outline only).
- **x**: `number` — Top-left x.
- **y**: `number` — Top-left y.
- **w**: `number` — Width.
- **h**: `number` — Height.
- **col**: `Color` — The color index.
- **returns**: `void`

##### `circ(x: number, y: number, r: number, col: Color): void`
Draws a filled circle.
- **x**: `number` — Center x.
- **y**: `number` — Center y.
- **r**: `number` — Radius.
- **col**: `Color` — The color index.
- **returns**: `void`

##### `circb(x: number, y: number, r: number, col: Color): void`
Draws a circle border (outline only).
- **x**: `number` — Center x.
- **y**: `number` — Center y.
- **r**: `number` — Radius.
- **col**: `Color` — The color index.
- **returns**: `void`

##### `elli(x: number, y: number, w: number, h: number, col: Color): void`
Draws a filled ellipse.
- **x**: `number` — Center x.
- **y**: `number` — Center y.
- **w**: `number` — Width.
- **h**: `number` — Height.
- **col**: `Color` — The color index.
- **returns**: `void`

##### `ellib(x: number, y: number, w: number, h: number, col: Color): void`
Draws an ellipse border (outline only).
- **x**: `number` — Center x.
- **y**: `number` — Center y.
- **w**: `number` — Width.
- **h**: `number` — Height.
- **col**: `Color` — The color index.
- **returns**: `void`

##### `tri(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, col: Color): void`
Draws a filled triangle.
- **x1**: `number` — First vertex x.
- **y1**: `number` — First vertex y.
- **x2**: `number` — Second vertex x.
- **y2**: `number` — Second vertex y.
- **x3**: `number` — Third vertex x.
- **y3**: `number` — Third vertex y.
- **col**: `Color` — The color index.
- **returns**: `void`

##### `trib(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, col: Color): void`
Draws a triangle border (outline only).
- **x1**: `number` — First vertex x.
- **y1**: `number` — First vertex y.
- **x2**: `number` — Second vertex x.
- **y2**: `number` — Second vertex y.
- **x3**: `number` — Third vertex x.
- **y3**: `number` — Third vertex y.
- **col**: `Color` — The color index.
- **returns**: `void`

##### `fill(x: number, y: number, col: Color): void`
Flood-fills an area starting at the given pixel.
- **x**: `number` — Start x.
- **y**: `number` — Start y.
- **col**: `Color` — The color index to fill with.
- **returns**: `void`

##### `text(x: number, y: number, text: string, col: Color): void`
Draws text at the specified position using the current font.
- **x**: `number` — Start x.
- **y**: `number` — Start y.
- **text**: `string` — The text to render.
- **col**: `Color` — The color index.
- **returns**: `void`

##### `textSize(text: string): Size | undefined`
Returns the size (width and height) of the given text string using the current font. Useful for aligning or measuring text before rendering.
- **text**: `string` — The text to measure.
- **returns**: `Size | undefined` — The size of the text as a `Size` object, or `undefined` if no font is set.

##### `blt(x: number, y: number, img: ImageIndex | CanvasIndex, u: number, v: number, w: number, h: number, colkey?: Color, rotate?: number, scale?: number): void`
Draws (blits) a region of an image to the screen, with optional color key, rotation, and scaling.
- **x**: `number` — Destination x.
- **y**: `number` — Destination y.
- **img**: `ImageIndex | CanvasIndex` — The image or canvas index to draw from.
- **u**: `number` — Source x in the image/canvas.
- **v**: `number` — Source y in the image/canvas.
- **w**: `number` — Width of the region.
- **h**: `number` — Height of the region.
- **colkey**: `Color` *(optional)* — Transparent color index.
- **rotate**: `number` *(optional)* — Rotation in degrees.
- **scale**: `number` *(optional)* — Scale factor.
- **returns**: `void`

##### `setCanvas(canvasIndex?: CanvasIndex): void`
Sets the current drawing canvas. If omitted, drawing will use the main screen canvas.
- **canvasIndex**: `CanvasIndex` *(optional)* — The index of the offscreen canvas to draw to. If omitted, resets to the main canvas.
- **returns**: `void`

---

## Example Usage

### Drawing Primitives and Images
```typescript
// Clear the screen with color 0
graphics.cls(0);
// Draw a red line
graphics.line(10, 10, 100, 100, 8);
// Draw a filled rectangle
graphics.rect(20, 20, 40, 30, 12);
// Draw an image region
graphics.blt(50, 50, playerImg, 0, 0, 16, 16);
// Draw text
graphics.text(10, 120, 'Hello, world!', 7);
```

---

## Design Philosophy

- **Expressive**: Rich set of drawing primitives for creative freedom.
- **Type-Safe**: All parameters and return values are fully typed.
- **Palette-Based**: Retro-inspired color management for authentic pixel art.
- **Performance**: Optimized for software rendering in modern browsers.

---

For more details on integrating the graphics API with other subsystems, see the [Passion engine documentation](./passion.md).
