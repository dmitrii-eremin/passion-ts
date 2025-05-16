import { DefaultColors, type Color } from "../color";

export class Palette {
    private colors: string[] = [...DefaultColors];
    private revertedColors: Record<string, number>;

    constructor() {
        this.revertedColors = Object.fromEntries(
            this.colors.map((color, index) => [color, index])
        );
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
}