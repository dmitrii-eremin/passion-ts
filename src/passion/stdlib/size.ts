export class Size {
    public width: number;
    public height: number;

    constructor(width: number = 0, height: number = 0) {
        this.width = width;
        this.height = height;
    }

    square(): number {
        return this.width * this.height;
    }

    clone(): Size {
        return new Size(this.width, this.height);
    }
}
