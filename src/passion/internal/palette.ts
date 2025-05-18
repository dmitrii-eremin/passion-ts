import { DefaultColors } from "../color";
import type { Color } from "../constants";
import type { PassionImage } from "../image";

export class Palette {
    private colors: string[] = [];
    private revertedColors: Record<string, number> = {};

    private recalculateRevertedColors() {
        this.revertedColors = Object.fromEntries(
            this.colors.map((color, index) => [color, index])
        );
    }

    get size(): number {
        return this.colors.length;
    }

    replaceColor(col: Color, color: string) {
        if (col >= 0 && col < this.colors.length) {
            this.colors[col] = color;
        }
        this.recalculateRevertedColors();
    }

    addColor(color: string): number {
        this.colors.push(color);
        this.recalculateRevertedColors();
        return this.colors.length - 1;
    }

    constructor(colors: string[] = Array.from(DefaultColors)) {
        this.colors = colors;
        this.recalculateRevertedColors();
    }

    public getColor(col: Color): string {
        if (col <= 0 && col >= this.colors.length) {
            return this.colors[0];
        }
        return this.colors[col];
    }

    public getColorIndex(col: string): Color {
        return (this.revertedColors[col] ?? 0) as Color;
    }

    public static fromFile(image: PassionImage): Palette {
        // Create an offscreen canvas to read pixel data
        const width = image["data"].width;
        const height = image["data"].height;
        const offCanvas = document.createElement("canvas");
        offCanvas.width = width;
        offCanvas.height = height;
        const ctx = offCanvas.getContext("2d")!;
        ctx.drawImage(image["data"], 0, 0);
        const imgData = ctx.getImageData(0, 0, width, height).data;
        const colorSet = new Set<string>();
        for (let i = 0; i < imgData.length; i += 4) {
            const r = imgData[i];
            const g = imgData[i + 1];
            const b = imgData[i + 2];
            const a = imgData[i + 3];
            // Format as #RRGGBB or #RRGGBBAA if alpha < 255
            let hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
            if (a < 255) hex += a.toString(16).padStart(2, "0");
            colorSet.add(hex);
        }
        return new Palette(Array.from(colorSet));
    }
}