export class PassionImage {
    private data: HTMLImageElement;
    private isReady: boolean = false;

    constructor(path: string) {
        this.data = new Image();
        this.data.src = path;
        this.data.onload = () => {
            this.isReady = true;
        };
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
        scale?: number
    ) {
        if (!this.isReady) return;

        // Save context state
        canvas.save();

        // Handle flipping
        let drawW = Math.abs(w);
        let drawH = Math.abs(h);

        // Set transform origin to (x, y)
        canvas.translate(x, y);

        // Apply scaling if specified
        if (scale) {
            canvas.scale(scale, scale);
        }

        // Handle flipping
        const flipX = w < 0 ? -1 : 1;
        const flipY = h < 0 ? -1 : 1;
        canvas.scale(flipX, flipY);

        // If flipped, translate by width/height to correct position
        if (w < 0) canvas.translate(-drawW, 0);
        if (h < 0) canvas.translate(0, -drawH);

        // Move origin to center of the drawn region (after flipping)
        canvas.translate(drawW / 2, drawH / 2);

        // Apply rotation if specified (now around center)
        if (rotate) {
            // If flipped odd number of times, invert rotation direction
            const flipCount = (w < 0 ? 1 : 0) + (h < 0 ? 1 : 0);
            const angle = (flipCount % 2 === 1 ? -1 : 1) * (rotate * Math.PI / 180);
            canvas.rotate(angle);
        }

        // Move origin back to top-left of the drawn region
        canvas.translate(-drawW / 2, -drawH / 2);

        // If colkey is specified, use an offscreen canvas to filter out the color
        if (colkey) {
            const offCanvas = document.createElement('canvas');
            offCanvas.width = drawW;
            offCanvas.height = drawH;
            const offCtx = offCanvas.getContext('2d')!;
            offCtx.drawImage(this.data, u, v, drawW, drawH, 0, 0, drawW, drawH);

            // Get image data and filter out colkey
            const imgData = offCtx.getImageData(0, 0, drawW, drawH);
            // Parse colkey string (e.g. "#001122" or "#001122FF")
            let hex = colkey.startsWith('#') ? colkey.slice(1) : colkey;
            if (hex.length === 3) {
                // Expand short hex (#123 -> #112233)
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
                    imgData.data[i + 3] = 0; // Set alpha to 0
                }
            }
            offCtx.putImageData(imgData, 0, 0);

            canvas.drawImage(offCanvas, 0, 0);
        } else {
            // Draw directly from source image
            canvas.drawImage(
                this.data,
                u, v, drawW, drawH, // source rect
                0, 0, drawW, drawH  // destination rect
            );
        }

        // Restore context state
        canvas.restore();
    }
}