import type { Color } from "../passion/constants";
import type { Passion } from "../passion/passion";
import { Position } from "../passion/stdlib/position";
import { EASINGS, Tween } from "../passion/stdlib/tween";

export type Ball = {
    pos: Position;
    col: Color;
}

export class Game {
    private passion: Passion;

    private ballsRows = 14;
    private ballsColumns = 14;
    private ballsRadius = 6;

    private readonly duration = 2;

    private balls: Ball[] = [];
    private tweens: Tween[] = [];

    private started = false;

    private getBallTarget(column: number, row: number): Position {
        const x = this.passion.system.width / 2 - (2 + this.ballsRadius) * this.ballsColumns + (2 + this.ballsRadius) * column * 2;
        const y = this.passion.system.height / 2 - (2 + this.ballsRadius) * this.ballsRows + (2 + this.ballsRadius) * row * 2;
        return Position.fromCoords(x, y);
    }

    constructor(passion: Passion) {
            this.passion = passion;
            this.passion.system.init(360, 240, 'Tweening demo');

            for (let i = 0; i < this.ballsRows; i++) {
                for (let j = 0; j < this.ballsColumns; j++) {
                    const ballX = this.passion.math.rndi(-300, 700);
                    const ballY = this.passion.math.rndi(-300, 700);

                    const ball = {
                        pos: Position.fromCoords(ballX, ballY),
                        col: this.passion.math.choice([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] as Color[]),
                    };

                    const target = this.getBallTarget(j, i);

                    this.balls.push(ball);
                    this.tweens.push(new Tween(ball.pos, {
                        x: target.x,
                        y: target.y,
                    }, this.duration, this.passion.math.choice(EASINGS)));
                }
            }
    }

    update(dt: number) {
        if (this.passion.input.btnp('Space')) {
            this.started = true;
        }

        if (this.started) {
            this.tweens.forEach(tween => {
                tween.update(dt);
            });
        }
    }

    draw() {
        this.passion.graphics.cls(1);
        this.balls.forEach(ball => {
            this.passion.graphics.circ(ball.pos.x, ball.pos.y, this.ballsRadius, ball.col);
        });

        if (!this.started) {
            this.passion.graphics.text(20, 20, 'Press <space> to start', 15);
        }
    }
}