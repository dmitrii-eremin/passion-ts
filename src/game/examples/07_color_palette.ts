import type { Passion } from "../../passion/passion";
import type { IGameExample } from "./example";

export class Example07 implements IGameExample {
    private passion: Passion;
    readonly exampleTitle: string = 'Color palette';

    private originalPalette: string[] = [];
    private otherPalette: string[] = [
        "#003f5c", // Deep Blue
        "#2f4b7c", // Indigo
        "#665191", // Purple
        "#a05195", // Violet
        "#d45087", // Magenta
        "#f95d6a", // Coral
        "#ff7c43", // Orange
        "#ffa600", // Gold
        "#b5e48c", // Light Green
        "#76c893", // Mint
        "#52b69a", // Teal
        "#168aad", // Cyan
        "#1e6091", // Blue
        "#184e77", // Navy
        "#f9c74f", // Yellow
        "#f9844a"  // Peach
    ];

    private currentPalette: string[] = [];

    constructor(passion: Passion) {
        this.passion = passion;
    }

    update(_dt: number): void {
        if (this.passion.input.btnp('Space')) {
            this.passion.graphics.pal(this.otherPalette);
            this.currentPalette = this.otherPalette;
        }
        if (this.passion.input.btnr('Space')) {
            this.passion.graphics.pal();
            this.currentPalette = this.originalPalette;
        }
    }

    draw(): void {
        this.passion.graphics.cls(0);
        this.passion.graphics.text(40, 30, '<Space> to change palette', 8);

        this.drawPalette({
            x: 20,
            y: 80,
            offsetX: 120,
            offsetY: 40,
            columns: 4
        });
    }

    private drawPalette(options: {x: number, y: number, offsetX: number, offsetY: number, columns: number}) {
        let nx = options.x;
        let ny = options.y;
        const w = 30;
        const h = 18;

        this.currentPalette.forEach((color, index) => {
            if (index > 0 && index % options.columns === 0) {
                nx = options.x;
                ny += options.offsetY;
            }

            this.passion.graphics.rectb(nx - 1, ny - 1, w + 2, h + 2, 8);
            this.passion.graphics.rect(nx, ny, w, h, index);
            this.passion.graphics.text(nx + w + 5, ny, `#${color}`, 15);
            this.passion.graphics.text(nx + w + 5, ny + 10, hexToRgbString(color), 15);

            nx += options.offsetX;
        });
    }

    onEnter() {
        this.passion.system.init(480, 360, this.exampleTitle);
        this.originalPalette = this.passion.graphics.pal();
        this.currentPalette = this.originalPalette;
    }

    onLeave() {

    }
}

function hexToRgbString(hex: string): string {
    // Remove leading '#' if present
    hex = hex.replace(/^#/, '');

    // Parse short form (#abc) to long form (#aabbcc)
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    if (hex.length !== 6) {
        throw new Error('Invalid hex color');
    }

    const num = parseInt(hex, 16);
    const r = (num >> 16) & 0xff;
    const g = (num >> 8) & 0xff;
    const b = num & 0xff;

    return `${r},${g},${b}`;
}