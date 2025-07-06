import type { Drawable } from "./drawable";

export class PassionCanvas implements Drawable {
    public readonly canvas: HTMLCanvasElement;
    public readonly context: CanvasRenderingContext2D;

    constructor(width: number, height: number) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get 2D context');
        }
        this.context = ctx;
    }

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
    ) {
        x = Math.ceil(x);
        y = Math.ceil(y);
        let drawW = Math.abs(w);
        let drawH = Math.abs(h);
        canvas.save();
        canvas.translate(x, y);
        if (scaleX) {
            scaleY = scaleY ?? scaleX;
            canvas.scale(scaleX, scaleY);
        }
        const flipX = w < 0 ? -1 : 1;
        const flipY = h < 0 ? -1 : 1;
        canvas.scale(flipX, flipY);
        if (w < 0) canvas.translate(-drawW, 0);
        if (h < 0) canvas.translate(0, -drawH);
        canvas.translate(drawW / 2, drawH / 2);
        if (rotate) {
            const flipCount = (w < 0 ? 1 : 0) + (h < 0 ? 1 : 0);
            const angle = (flipCount % 2 === 1 ? -1 : 1) * (rotate * Math.PI / 180);
            canvas.rotate(angle);
        }
        canvas.translate(-drawW / 2, -drawH / 2);
        if (colkey) {
            const offCanvas = document.createElement('canvas');
            offCanvas.width = drawW;
            offCanvas.height = drawH;
            const offCtx = offCanvas.getContext('2d')!;
            offCtx.drawImage(this.canvas, u, v, drawW, drawH, 0, 0, drawW, drawH);
            const imgData = offCtx.getImageData(0, 0, drawW, drawH);
            let hex = colkey.startsWith('#') ? colkey.slice(1) : colkey;
            if (hex.length === 3) {
                hex = hex.split('').map(c => c + c).join('');
            }
            let rKey = parseInt(hex.slice(0, 2), 16);
            let gKey = parseInt(hex.slice(2, 4), 16);
            let bKey = parseInt(hex.slice(4, 6), 16);
            let aKey = hex.length >= 8 ? parseInt(hex.slice(6, 8), 16) : 255;
            for (let i = 0; i < imgData.data.length; i += 4) {
                if (
                    imgData.data[i] === rKey &&
                    imgData.data[i + 1] === gKey &&
                    imgData.data[i + 2] === bKey &&
                    imgData.data[i + 3] === aKey
                ) {
                    imgData.data[i + 3] = 0;
                }
            }
            offCtx.putImageData(imgData, 0, 0);
            canvas.drawImage(offCanvas, 0, 0);
        } else {
            canvas.drawImage(
                this.canvas,
                u, v, drawW, drawH,
                0, 0, drawW, drawH
            );
        }
        canvas.restore();
    }
}