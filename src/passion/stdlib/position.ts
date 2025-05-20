export class Position {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    static fromPosition(pos: Position): Position {
        return new Position(pos.x, pos.y);
    }

    static fromCoords(x: number, y: number): Position {
        return new Position(x, y);
    }
}