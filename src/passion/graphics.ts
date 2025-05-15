import type { Color } from "./color";
import type { PassionData } from "./data";

export class Graphics {
    private data: PassionData;

    constructor(data: PassionData) {
        this.data = data;
    }

    cls(color: Color) {
        if (!this.data.isReady()) {
            return;
        }

        this.data.context!.fillStyle = color;
        this.data.context!.fillRect(0, 0, this.data.canvas!.width, this.data.canvas!.height);
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

        this.data.context!.strokeStyle = color;
        this.data.context!.lineWidth = 1;
        this.data.context!.strokeRect(x, y, w, h);
    }
}