export class Rect {
    left: number = 0;
    top: number = 0;
    width: number = 0;
    height: number = 0;

    constructor(left: number = 0, top: number = 0, width: number = 0, height: number = 0) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }

    get right(): number {
        return this.left + this.width;
    }

    get bottom(): number {
        return this.top + this.height;
    }

    static fromCoords(left: number, top: number, width: number, height: number): Rect {
        return new Rect(left, top, width, height);
    }

    static fromRect(rect: Rect): Rect {
        return new Rect(rect.left, rect.top, rect.width, rect.height);
    }
}