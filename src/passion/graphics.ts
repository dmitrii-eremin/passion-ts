import { Colors, type Color } from "./color";
import type { PassionData } from "./data";
import { BdfFont } from "./internal/bdf_font";
import { DefaultBdfFont } from "./resources/default_bdf_font";
import type { SubSystem } from "./subsystem";

export interface IGraphics {
    cls(color: Color): void;

    pget(x: number, y: number): Color;
    pset(x: number, y: number, color: Color): void;

    line(x1: number, y1: number, x2: number, y2: number, color: Color): void;

    rect(x: number, y: number, w: number, h: number, color: Color): void;
    rectb(x: number, y: number, w: number, h: number, color: Color): void;

    circ(x: number, y: number, r: number, color: Color): void;
    circb(x: number, y: number, r: number, color: Color): void;

    elli(x: number, y: number, w: number, h: number, color: Color): void;
    ellib(x: number, y: number, w: number, h: number, color: Color): void;

    tri(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color: Color): void;
    trib(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color: Color): void;

    fill(x: number, y: number, color: Color): void;
    text(x: number, y: number, text: string, color: Color): void;
}

export class Graphics implements IGraphics, SubSystem {
    private data: PassionData;
    private bdfFont: BdfFont;

    constructor(data: PassionData) {
        this.data = data;
        this.bdfFont = new BdfFont(DefaultBdfFont);
    }

    onAfterAll(dt: number) {

    }

    cls(color: Color) {
        if (!this.data.isReady()) {
            return;
        }

        this.data.context!.fillStyle = color;
        this.data.context!.fillRect(0, 0, this.data.canvas!.width, this.data.canvas!.height);
    }

    pget(x: number, y: number): Color {
        if (!this.data.isReady()) {
            return Colors[0];
        }

        const ctx = this.data.context!;
        const imageData = ctx.getImageData(x, y, 1, 1).data;
        const [r, g, b, _] = imageData;
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}` as Color;
    }

    pset(x: number, y: number, color: Color) {
        if (!this.data.isReady()) {
            return;
        }

        const ctx = this.data.context!;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
    }

    line(x1: number, y1: number, x2: number, y2: number, color: Color) {
        if (!this.data.isReady()) {
            return;
        }

        const ctx = this.data.context!;
        ctx.fillStyle = color;

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

    rect(x: number, y: number, w: number, h: number, color: Color) {
        if (!this.data.isReady()) {
            return;
        }

        this.data.context!.fillStyle = color;
        this.data.context!.fillRect(x, y, w, h);
    }

    rectb(x: number, y: number, w: number, h: number, color: Color) {
        if (!this.data.isReady()) {
            return;
        }

        this.line(x, y, x + w - 1, y, color);
        this.line(x, y, x, y + h - 1, color);
        this.line(x + w - 1, y, x + w - 1, y + h - 1, color);
        this.line(x, y + h - 1, x + w - 1, y + h - 1, color);
    }

    circ(x: number, y: number, r: number, color: Color) {
        if (!this.data.isReady()) {
            return;
        }

        const ctx = this.data.context!;
        
        ctx.fillStyle = color;
        const r2 = r * r;
        for (let dy = -r; dy <= r; dy++) {
            for (let dx = -r; dx <= r; dx++) {
                if (dx * dx + dy * dy <= r2) {
                    ctx.fillStyle = color;
                    ctx.fillRect(x + dx, y + dy, 1, 1);
                }
            }
        }
    }

    circb(x: number, y: number, r: number, color: Color) {
        if (!this.data.isReady()) {
            return;
        }

        const ctx = this.data.context!;
        ctx.fillStyle = color;

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

    elli(x: number, y: number, w: number, h: number, color: Color) {
        if (!this.data.isReady()) {
            return;
        }

        const ctx = this.data.context!;
        ctx.fillStyle = color;

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

    ellib(x: number, y: number, w: number, h: number, color: Color) {
        if (!this.data.isReady()) {
            return;
        }

        const ctx = this.data.context!;
        ctx.fillStyle = color;

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

    tri(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color: Color) {
        if (!this.data.isReady()) {
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
                    this.pset(x, y, color);
                }
            }
        }
    }

    trib(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color: Color) {
        if (!this.data.isReady()) {
            return;
        }

        this.line(x1, y1, x2, y2, color);
        this.line(x2, y2, x3, y3, color);
        this.line(x3, y3, x1, y1, color);
    }

    fill(x: number, y: number, color: Color) {
        if (!this.data.isReady()) {
            return;
        }

        const width = this.data.canvas!.width;
        const height = this.data.canvas!.height;

        const targetColor = this.pget(x, y);
        if (targetColor === color) {
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

            this.pset(cx, cy, color);

            stack.push([cx + 1, cy]);
            stack.push([cx - 1, cy]);
            stack.push([cx, cy + 1]);
            stack.push([cx, cy - 1]);
        }
    }

    text(x: number, y: number, text: string, color: Color) {
        if (!this.data.isReady()) {
            return;
        }
        
        this.bdfFont.render(x, y, text, (x: number, y: number) => {
            this.pset(x, y, color);
        });
    }
}