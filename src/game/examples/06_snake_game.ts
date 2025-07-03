import type { Passion } from "../../passion/passion";
import { Position } from "../../passion/stdlib/position";
import type { IGameExample } from "./example";

const TOP_BAR_HEIGHT = 16;

class Fruit {
    private passion: Passion;
    pos: Position;

    constructor(passion: Passion, x: number, y: number) {
        this.passion = passion;
        this.pos = new Position(x, y);
    }

    draw() {
        this.passion.graphics.pset(this.pos.x, this.pos.y, 8);
    }
}

class Snake {
    private passion: Passion;
    private pos: Position[] = [];
    private direction: Position = new Position(0, 0);

    private passedTime = 0;
    private isMovedOnce = false;

    private get Speed(): number {
        const len = Math.ceil(this.pos.length / 10) / 100;
        return Math.max(0.03, 0.07 - len);
    }

    constructor(passion: Passion) {
        this.passion = passion;

        const initialPosition = new Position(Math.ceil(this.passion.system.width / 2), Math.ceil(this.passion.system.height / 2));
        for (let i = 0; i < 3; i++) {
            this.pos.push(initialPosition.clone());
        }
    }

    setDirection(newDirection: Position) {
        if (
            (newDirection.x == -1 && this.direction.x == 1) ||
            (newDirection.x == 1 && this.direction.x == -1) ||
            (newDirection.y == -1 && this.direction.y == 1) ||
            (newDirection.y == 1 && this.direction.y == -1)) {
            return;
        }
        this.direction = newDirection.clone();
    }

    eatFruit(fruit?: Fruit): boolean {
        if (fruit === undefined) {
            return false;
        }
        return Math.floor(this.pos[0].x) === fruit.pos.x &&
               Math.floor(this.pos[0].y) === fruit.pos.y;
    }

    isIntersectingItself(): boolean {
        if (!this.isMovedOnce) {
            return false;
        }

        for (let i = 1; i < this.pos.length; i++) {
            if (this.pos[0].x === this.pos[i].x && this.pos[0].y === this.pos[i].y) {
                return true;
            }
        }
        return false;
    }

    isOutOfWorld(): boolean {
        const head = this.pos[0];
        return (
            head.x < 0 ||
            head.x >= this.passion.system.width ||
            head.y < TOP_BAR_HEIGHT ||
            head.y >= this.passion.system.height
        );
    }

    add() {
        this.pos.push(this.pos[this.pos.length - 1].clone());
    }

    update(dt: number) {
        if (this.direction.length > 0) {
            this.passedTime += dt;
            if (this.passedTime >= this.Speed) {
                this.passedTime -= this.Speed;

                for (let i = this.pos.length - 1; i > 0; i--) {
                    this.pos[i].x = this.pos[i - 1].x;
                    this.pos[i].y = this.pos[i - 1].y;
                }

                this.pos[0].x += this.direction.x;
                this.pos[0].y += this.direction.y;

                this.isMovedOnce = true;
            }
        }
    }

    draw() {
        for (let i = this.pos.length - 1; i >= 0; i--) {
            const color = i === 0 ? 3 : 7;
            this.passion.graphics.pset(this.pos[i].x, this.pos[i].y, color);
        }
    }
}

class Direction {
    static readonly Up = new Position(0, -1);
    static readonly Down = new Position(0, 1);
    static readonly Left = new Position(-1, 0);
    static readonly Right = new Position(1, 0);
}

export class Example06 implements IGameExample {
    private passion: Passion;

    private score: number = 0;
    private snake: Snake;
    private fruit?: Fruit;

    private isFinalScore = false;
    
    constructor(passion: Passion) {
        this.passion = passion;
        this.snake = new Snake(passion);
    }

    update(dt: number): void {
        if (!this.isFinalScore) {
            if (this.passion.input.btnp('ArrowDown')) {
                this.snake.setDirection(Direction.Down);
            }
            if (this.passion.input.btnp('ArrowUp')) {
                this.snake.setDirection(Direction.Up);
            }
            if (this.passion.input.btnp('ArrowLeft')) {
                this.snake.setDirection(Direction.Left);
            }
            if (this.passion.input.btnp('ArrowRight')) {
                this.snake.setDirection(Direction.Right);
            }
            this.snake.update(dt);
        
            if (this.snake.eatFruit(this.fruit)) {
                this.createNewFruit();
                this.snake.add();
                this.score += 10;
            }

            if (this.snake.isIntersectingItself() || this.snake.isOutOfWorld()) {
                this.isFinalScore = true;
            }
        }
        else {
            if (this.passion.input.btnp('Space')) {
                this.reset();
            }
        }
    }

    draw(): void {
        if (this.isFinalScore) {
            this.passion.graphics.cls(1);
            this.passion.graphics.text(15, 10, `Final`, 7);
            this.passion.graphics.text(15, 30, `SCORE`, 7);
            this.passion.graphics.text(15, 50, `${this.score}`, 7);
        }
        else {
            this.passion.graphics.cls(1);
            this.fruit?.draw();
            this.snake.draw();
            this.drawScore();
        }
    }

    reset() {
        this.isFinalScore = false;
        this.score = 0;
        this.snake = new Snake(this.passion);
        this.createNewFruit();
    }

    onEnter() {
        this.passion.system.init(64, 84, 'Example 06: Snake game');
        this.reset();
    }
    onLeave() {}

    private drawScore() {
        this.passion.graphics.rect(0, 0, 64, TOP_BAR_HEIGHT, 5);
        this.passion.graphics.text(4, 4, `${this.score}`, 0);
        this.passion.graphics.text(3, 3, `${this.score}`, 3);
    }

    private createNewFruit() {
        this.fruit = new Fruit(this.passion,
            this.passion.math.rndi(1, this.passion.system.width - 2),
            this.passion.math.rndi(TOP_BAR_HEIGHT + 1, this.passion.system.height - 2 - TOP_BAR_HEIGHT),
        );
    }
}