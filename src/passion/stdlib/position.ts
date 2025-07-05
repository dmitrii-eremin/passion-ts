export class Position {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    apply(fn: (val: number) => number): Position {
        return new Position(fn(this.x), fn(this.y));
    }

    clone(): Position {
        return new Position(this.x, this.y);
    }

    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): Position {
        const length = Math.sqrt(this.x * this.x + this.y * this.y);
        if (length === 0) {
            return new Position(0, 0);
        }
        return new Position(this.x / length, this.y / length);
    }

    add(other: Position): Position {
        return new Position(this.x + other.x, this.y + other.y);
    }

    substract(other: Position): Position {
        return new Position(this.x - other.x, this.y - other.y);
    }

    multiple(num: number): Position {
        return new Position(num * this.x, num * this.y);
    }

    static fromPosition(pos: Position): Position {
        return new Position(pos.x, pos.y);
    }

    static fromCoords(x: number, y: number): Position {
        return new Position(x, y);
    }

    static random(): Position {
        const angle = Math.random() * 2 * Math.PI;
        return new Position(Math.cos(angle), Math.sin(angle));
    }
}
