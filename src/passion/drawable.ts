export interface Drawable {
    blt(
        canvas: CanvasRenderingContext2D,
        x: number,
        y: number,
        u: number,
        v: number,
        w: number,
        h: number,
        colkey?: string,
        rotate?: number,
        scaleX?: number,
        scaleY?: number,
    ): void;
}