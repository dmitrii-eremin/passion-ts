import type { CanvasIndex, FontIndex, ImageIndex } from "./constants";
import { type Color } from "./constants";
import type { PassionData } from "./data";
import type { Drawable } from "./drawable";
import { PassionImage } from "./image";
import type { BdfFont } from "./internal/bdf_font";
import { Palette } from "./internal/palette";
import { DefaultBdfFont } from "./resources/default_bdf_font";
import type { Size } from "./stdlib/size";
import type { SubSystem } from "./subsystem";

export interface IGraphics {
    readonly images: PassionImage[];

    camera(x?: number, y?: number): void;
    clip(left?: number, top?: number, width?: number, height?: number): void;

    pal(colors?: string[]): string[];

    font(fontIndex?: FontIndex): void;
    textSize(text: string): Size | undefined;

    setCanvas(canvasIndex?: CanvasIndex): void;

    cls(col: Color): void;

    pget(x: number, y: number): Color;
    pset(x: number, y: number, col: Color): void;

    line(x1: number, y1: number, x2: number, y2: number, col: Color): void;

    rect(x: number, y: number, w: number, h: number, col: Color): void;
    rectb(x: number, y: number, w: number, h: number, col: Color): void;

    circ(x: number, y: number, r: number, col: Color): void;
    circb(x: number, y: number, r: number, col: Color): void;

    elli(x: number, y: number, w: number, h: number, col: Color): void;
    ellib(x: number, y: number, w: number, h: number, col: Color): void;

    tri(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, col: Color): void;
    trib(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, col: Color): void;

    fill(x: number, y: number, col: Color): void;
    text(x: number, y: number, text: string, col: Color): void;

    blt(x: number, y: number, img: ImageIndex | CanvasIndex, u: number, v: number, w: number, h: number, colkey?: Color, rotate?: number, scale?: number): void;
}

export class Graphics implements IGraphics, SubSystem {
    private data: PassionData;
    private palette: Palette = new Palette();

    private defaultFont?: FontIndex;
    private currentFont?: FontIndex;
    private customCanvas?: CanvasIndex;

    constructor(data: PassionData) {
        this.data = data;
    }

    onBeforeAll(_dt: number) {}
    onAfterAll(_dt: number) {}

    get images(): PassionImage[] {
        return Array.from(this.data.images.values());
    }

    camera(x?: number, y?: number) {
        if (this.currentCanvas === undefined || this.currentContext === undefined) {
            return;
        }

        if (x === undefined) x = 0;
        if (y === undefined) y = 0;

        const scale = this.data.displayScale;
        this.currentContext.setTransform(scale, 0, 0, scale, -x * scale, -y * scale);
    }

    clip(left?: number, top?: number, width?: number, height?: number) {
        if (this.currentCanvas === undefined || this.currentContext === undefined) {
            return;
        }

        const ctx = this.currentContext;
        if (left === undefined && top === undefined && width === undefined && height === undefined) {
            ctx.restore();
        }
        else if (left && top && width && height) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(left, top, width, height);
            ctx.clip();
        }
    }

    pal(colors?: string[]): string[] {
        this.palette = new Palette(colors);
        return this.palette.allColors;
    }

    font(fontIndex?: FontIndex) {
        if (fontIndex === undefined) {
            if (this.defaultFont === undefined) {
                this.defaultFont = this.data.resource?.loadFont(DefaultBdfFont);
            }
            this.currentFont = this.defaultFont;
        } else {
            this.currentFont = fontIndex;
        }
    }

    textSize(text: string): Size | undefined {
        if (this.currentFont === undefined) {
            return undefined;
        }
        const font: BdfFont | undefined = this.data.fonts.get(this.currentFont);
        return font?.getTextSize(text);
    }

    setCanvas(canvasIndex?: CanvasIndex): void {
        this.customCanvas = canvasIndex;
    }

    private get currentCanvas(): HTMLCanvasElement | undefined {
        if (this.customCanvas !== undefined) {
            const canvasToRender = this.data.canvases.get(this.customCanvas);
            if (canvasToRender !== undefined) {
                return canvasToRender.canvas;
            }
        }
        if (this.data.isReady()) {
            return this.data.canvas;
        }
    }

    private get currentContext(): CanvasRenderingContext2D | undefined {
        if (this.customCanvas !== undefined) {
            const canvasToRender = this.data.canvases.get(this.customCanvas);
            if (canvasToRender !== undefined) {
                return canvasToRender.context;
            }
        }
        if (this.data.isReady()) {
            return this.data.context;
        }
    }

    cls(col: Color) {
        if (this.currentCanvas === undefined || this.currentContext === undefined) {
            return;
        }

        const transform = this.currentContext.getTransform();
        this.currentContext.resetTransform();

        this.currentContext.fillStyle = this.palette.getColor(col);
        this.currentContext.fillRect(-100, -100, 100 + this.currentCanvas.width, 100 + this.currentCanvas.height);

        this.currentContext.setTransform(transform);
    }

    pget(x: number, y: number): Color {
        if (this.currentCanvas === undefined || this.currentContext === undefined) {
            return 0;
        }

        const ctx = this.currentContext;
        const imageData = ctx.getImageData(x, y, 1, 1).data;
        const [r, g, b, _] = imageData;
        const color = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        return this.palette.getColorIndex(color);
    }

    pset(x: number, y: number, col: Color) {
        if (this.currentCanvas === undefined || this.currentContext === undefined) {
            return;
        }

        const ctx = this.currentContext;
        ctx.fillStyle = this.palette.getColor(col);
        ctx.fillRect(Math.ceil(x), Math.ceil(y), 1, 1);
    }

    line(x1: number, y1: number, x2: number, y2: number, col: Color) {
        if (this.currentCanvas === undefined || this.currentContext === undefined) {
            return;
        }

        x1 = Math.ceil(x1);
        y1 = Math.ceil(y1);
        x2 = Math.ceil(x2);
        y2 = Math.ceil(y2);

        const ctx = this.currentContext;
        ctx.fillStyle = this.palette.getColor(col);

        let dx = Math.abs(x2 - x1);
        let dy = Math.abs(y2 - y1);
        let sx = x1 < x2 ? 1 : -1;
        let sy = y1 < y2 ? 1 : -1;
        let err = dx - dy;

        while (true) {
            ctx.fillRect(x1, y1, 1, 1);

            if (x1 === x2 && y1 === y2) break;
            let e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x1 += sx; }
            if (e2 < dx) { err += dx; y1 += sy; }
        }
    }

    rect(x: number, y: number, w: number, h: number, col: Color) {
        if (this.currentCanvas === undefined || this.currentContext === undefined) {
            return;
        }

        x = Math.ceil(x);
        y = Math.ceil(y);
        w = Math.ceil(w);
        h = Math.ceil(h);

        this.currentContext.fillStyle = this.palette.getColor(col);
        this.currentContext.fillRect(x, y, w, h);
    }

    rectb(x: number, y: number, w: number, h: number, col: Color) {
        if (this.currentCanvas === undefined || this.currentContext === undefined) {
            return;
        }

        x = Math.ceil(x);
        y = Math.ceil(y);
        w = Math.ceil(w);
        h = Math.ceil(h);

        this.line(x, y, x + w - 1, y, col);
        this.line(x, y, x, y + h - 1, col);
        this.line(x + w - 1, y, x + w - 1, y + h - 1, col);
        this.line(x, y + h - 1, x + w - 1, y + h - 1, col);
    }

    circ(x: number, y: number, r: number, col: Color) {
        if (this.currentCanvas === undefined || this.currentContext === undefined) {
            return;
        }

        const ctx = this.currentContext;
        
        ctx.fillStyle = this.palette.getColor(col);
        const r2 = r * r;
        for (let dy = -r; dy <= r; dy++) {
            for (let dx = -r; dx <= r; dx++) {
                if (dx * dx + dy * dy <= r2) {
                    ctx.fillStyle = this.palette.getColor(col);
                    ctx.fillRect(x + dx, y + dy, 1, 1);
                }
            }
        }
    }

    circb(x: number, y: number, r: number, col: Color) {
        if (this.currentCanvas === undefined || this.currentContext === undefined) {
            return;
        }

        x = Math.ceil(x);
        y = Math.ceil(y);

        const ctx = this.currentContext;
        ctx.fillStyle = this.palette.getColor(col);

        let r2 = r * r;
        let r1 = (r - 1) * (r - 1);

        for (let dy = -r; dy <= r; dy++) {
            for (let dx = -r; dx <= r; dx++) {
                let d2 = dx * dx + dy * dy;
                if (d2 <= r2 && d2 >= r1) {
                    ctx.fillRect(x + dx, y + dy, 1, 1);
                }
            }
        }
    }

    elli(x: number, y: number, w: number, h: number, col: Color) {
        if (this.currentCanvas === undefined || this.currentContext === undefined) {
            return;
        }

        const ctx = this.currentContext;
        ctx.fillStyle = this.palette.getColor(col);

        const a = w / 2;
        const b = h / 2;
        for (let dy = -Math.floor(b); dy <= Math.floor(b); dy++) {
            for (let dx = -Math.floor(a); dx <= Math.floor(a); dx++) {
                if ((dx * dx) / (a * a) + (dy * dy) / (b * b) <= 1) {
                    ctx.fillRect(x + dx, y + dy, 1, 1);
                }
            }
        }
    }

    ellib(x: number, y: number, w: number, h: number, col: Color) {
        if (this.currentCanvas === undefined || this.currentContext === undefined) {
            return;
        }

        const ctx = this.currentContext;
        ctx.fillStyle = this.palette.getColor(col);

        const a = w / 2;
        const b = h / 2;
        const a2 = a * a;
        const b2 = b * b;
        const a1 = (a - 1);
        const b1 = (b - 1);
        const a1_2 = a1 * a1;
        const b1_2 = b1 * b1;

        for (let dy = -Math.floor(b); dy <= Math.floor(b); dy++) {
            for (let dx = -Math.floor(a); dx <= Math.floor(a); dx++) {
                const ellipseEq = (dx * dx) / a2 + (dy * dy) / b2;
                const innerEllipseEq = (dx * dx) / a1_2 + (dy * dy) / b1_2;
                if (ellipseEq <= 1 && innerEllipseEq >= 1) {
                    ctx.fillRect(x + dx, y + dy, 1, 1);
                }
            }
        }
    }

    tri(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, col: Color) {
        if (this.currentCanvas === undefined || this.currentContext === undefined) {
            return;
        }

        // Find bounding box
        const minX = Math.min(x1, x2, x3);
        const maxX = Math.max(x1, x2, x3);
        const minY = Math.min(y1, y2, y3);
        const maxY = Math.max(y1, y2, y3);

        // Barycentric coordinates
        function edge(x0: number, y0: number, x1: number, y1: number, x: number, y: number) {
            return (x - x0) * (y1 - y0) - (y - y0) * (x1 - x0);
        }

        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const w0 = edge(x2, y2, x3, y3, x, y);
                const w1 = edge(x3, y3, x1, y1, x, y);
                const w2 = edge(x1, y1, x2, y2, x, y);
                if (
                    (w0 >= 0 && w1 >= 0 && w2 >= 0) ||
                    (w0 <= 0 && w1 <= 0 && w2 <= 0)
                ) {
                    this.pset(x, y, col);
                }
            }
        }
    }

    trib(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, col: Color) {
        if (this.currentCanvas === undefined || this.currentContext === undefined) {
            return;
        }

        this.line(x1, y1, x2, y2, col);
        this.line(x2, y2, x3, y3, col);
        this.line(x3, y3, x1, y1, col);
    }

    fill(x: number, y: number, col: Color) {
        if (this.currentCanvas === undefined || this.currentContext === undefined) {
            return;
        }

        const width = this.currentCanvas.width;
        const height = this.currentCanvas.height;

        const targetColor = this.pget(x, y);
        if (targetColor === col) {
            return;
        }

        const stack: [number, number][] = [[x, y]];

        while (stack.length > 0) {
            const [cx, cy] = stack.pop()!;
            if (
                cx < 0 || cy < 0 ||
                cx >= width || cy >= height ||
                this.pget(cx, cy) !== targetColor
            ) {
                continue;
            }

            this.pset(cx, cy, col);

            stack.push([cx + 1, cy]);
            stack.push([cx - 1, cy]);
            stack.push([cx, cy + 1]);
            stack.push([cx, cy - 1]);
        }
    }

    text(x: number, y: number, text: string, col: Color) {
        if (!this.data.isReady() || !this.currentFont) {
            return;
        }

        this.data.fonts.get(this.currentFont)?.render(x, y, text, (x: number, y: number) => {
            this.pset(x, y, col);
        });
    }

    blt(x: number, y: number, img: ImageIndex | CanvasIndex, u: number, v: number, w: number, h: number, colkey?: Color, rotate?: number, scale?: number) {
        if (this.currentCanvas === undefined || this.currentContext === undefined) {
            return;
        }

        const color = colkey ? this.palette.getColor(colkey) : undefined;
        const drawable: Drawable | undefined = this.data.images.get(img) ?? this.data.canvases.get(img);
        drawable?.blt(this.currentContext, x, y, u, v, w, h, color, rotate, scale);
    }
}