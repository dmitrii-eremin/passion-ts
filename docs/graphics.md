# Graphics Subsystem Documentation

## Overview

The `Graphics` class provides all 2D drawing and rendering functionality for the Passion engine. It implements the `IGraphics` interface and exposes a wide range of methods for drawing shapes, images, text, and manipulating the rendering context. This subsystem is responsible for all visual output to the HTML canvas.

---

## Interface: IGraphics

### Properties
- **images: PassionImage[]**  
  Read-only array of loaded images.

### Methods
- **camera(x?: number, y?: number): void**  
  Sets the camera position for rendering.
- **pal(colors?: string[]): void**  
  Sets the color palette.
- **font(bdfFontData?: string): void**  
  Sets the font for text rendering (BDF format).
- **cls(col: Color): void**  
  Clears the screen with the given color.
- **pget(x: number, y: number): Color**  
  Gets the color at pixel (x, y).
- **pset(x: number, y: number, col: Color): void**  
  Sets the color at pixel (x, y).
- **line(x1: number, y1: number, x2: number, y2: number, col: Color): void**  
  Draws a line between two points.
- **rect(x: number, y: number, w: number, h: number, col: Color): void**  
  Draws a filled rectangle.
- **rectb(x: number, y: number, w: number, h: number, col: Color): void**  
  Draws a rectangle border.
- **circ(x: number, y: number, r: number, col: Color): void**  
  Draws a filled circle.
- **circb(x: number, y: number, r: number, col: Color): void**  
  Draws a circle border.
- **elli(x: number, y: number, w: number, h: number, col: Color): void**  
  Draws a filled ellipse.
- **ellib(x: number, y: number, w: number, h: number, col: Color): void**  
  Draws an ellipse border.
- **tri(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, col: Color): void**  
  Draws a filled triangle.
- **trib(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, col: Color): void**  
  Draws a triangle border.
- **fill(x: number, y: number, col: Color): void**  
  Flood-fills an area starting at (x, y) with the given color.
- **text(x: number, y: number, text: string, col: Color): void**  
  Draws text at the specified position.
- **blt(x: number, y: number, img: ImageIndex, u: number, v: number, w: number, h: number, colkey?: Color, rotate?: number, scale?: number): void**  
  Draws an image or a region of an image with optional color key, rotation, and scaling.

---

## Class: Graphics

### Constructor
```typescript
constructor(data: PassionData)
```
- **data**: Internal engine data object.

Initializes the graphics subsystem, font, and palette.

### Lifecycle Methods
- **onBeforeAll(dt: number): void**  
  Called before each frame (internal use).
- **onAfterAll(dt: number): void**  
  Called after each frame (internal use).

### Example Usage
```typescript
// Set background color
passion.graphics.cls(0);

// Draw a red rectangle
passion.graphics.rect(10, 10, 50, 30, 2);

// Draw text
passion.graphics.text(20, 60, 'Hello!', 3);

// Draw an image
passion.graphics.blt(40, 40, 0, 0, 0, 16, 16);
```

---

## Notes
- All drawing operations are performed on the HTML canvas context.
- The color parameter (`col`) is an index into the current palette.
- The subsystem supports pixel-level manipulation and basic shape drawing.
- The `blt` method supports advanced image operations including color keying, rotation, and scaling.
- The `font` method expects a BDF font string; a default font is provided.

---

## See Also
- [Passion Class Documentation](./passion.md)
- [Usage Guide](usage.md)
