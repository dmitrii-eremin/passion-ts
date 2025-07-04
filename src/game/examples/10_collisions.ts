import { generateUniqueName } from "../../passion/internal/random_id";
import type { Passion } from "../../passion/passion";
import { Bump, type World } from "../../passion/stdlib/bump";
import { Position } from "../../passion/stdlib/position";
import type { IGameExample } from "./example";

class Body {
    private passion: Passion;
    private world?: World;
    private id: string = generateUniqueName('example_body_');
    private speed = 50;

    pos: Position;
    size: Position;
    private isPlayer: boolean = false;

    constructor(passion: Passion, pos: Position, size: Position, isPlayer: boolean = false) {
        this.passion = passion;
        this.pos = pos;
        this.size = size;
        this.isPlayer = isPlayer;
    }

    initializeCollisions(world: World) {
        this.world = world;
        this.world.add(this.id, this.pos.x, this.pos.y, this.size.x, this.size.y);
    }

    update(dt: number) {
        if (!this.isPlayer) {
            return;
        }

        this.control(dt);
    }

    draw() {
        this.passion.graphics.rect(this.pos.x + 1, this.pos.y + 1, this.size.x - 2, this.size.y - 2, this.isPlayer ? 8 : 1);
        this.passion.graphics.rectb(this.pos.x, this.pos.y, this.size.x, this.size.y, 7);
    }

    contains(point: Position): boolean {
        return (
            point.x >= this.pos.x &&
            point.x <= this.pos.x + this.size.x &&
            point.y >= this.pos.y &&
            point.y <= this.pos.y + this.size.y
        );
    }

    intersects(other: Body): boolean {
        return !(
            this.pos.x + this.size.x < other.pos.x ||
            this.pos.x > other.pos.x + other.size.x ||
            this.pos.y + this.size.y < other.pos.y ||
            this.pos.y > other.pos.y + other.size.y
        );
    }

    private control(dt: number) {
            let delta = new Position(0, 0);
            if (this.passion.input.btn('ArrowDown')) {
                delta.y += 1;
            }
            if (this.passion.input.btn('ArrowUp')) {
                delta.y -= 1;
            }
            if (this.passion.input.btn('ArrowRight')) {
                delta.x += 1;
            }
            if (this.passion.input.btn('ArrowLeft')) {
                delta.x -= 1;
            }
            delta = delta.normalize().multiple(this.speed * dt);

            this.pos = this.pos.add(delta);

            const goal = this.pos.add(delta);
            const actual = this.world?.move(this.id, goal.x, goal.y);
            this.pos = actual !== undefined ? Position.fromCoords(actual.x, actual.y) : goal;
        }
}

export class Example10 implements IGameExample {
    private passion: Passion;
    private world: World;

    readonly exampleTitle: string = 'Collisions';

    private readonly bodiesCount = 30;
    private bodies: Body[] = [];
    private player?: Body;

    constructor(passion: Passion) {
        this.passion = passion;
    }

    update(dt: number): void {
        this.bodies.forEach(b => b.update(dt));
        this.player?.update(dt);
    }

    draw(): void {
        this.passion.graphics.cls(0);
        this.bodies.forEach(b => b.draw());
        this.player?.draw();
    }

    onEnter() {
        this.passion.system.init(360, 240, this.exampleTitle);
        this.world = Bump.newWorld(16);

        this.bodies = this.generateBodies(this.bodiesCount);
        this.player = new Body(this.passion, new Position(), new Position(16, 16), true);
        this.placeToFreeSpace(this.player, this.bodies);

        this.bodies.forEach(b => b.initializeCollisions(this.world));
        this.player.initializeCollisions(this.world);

        this.addWorldLimits();
    }

    onLeave() {

    }

    private addWorldLimits() {
        this.world?.add('leftwall', -10, 0, 10, this.passion.system.height);
        this.world?.add('rightwall', this.passion.system.width, 0, 10, this.passion.system.height);

        this.world?.add('upwall', 0, -10, this.passion.system.width, 10);
        this.world?.add('downwall', 0, this.passion.system.height, this.passion.system.width, 10);
    }

    private generateBodies(count: number): Body[] {
        const bodies: Body[] = [];
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < 150; j++) {
                let size = new Position(
                    this.passion.math.rndi(15, 30),
                    this.passion.math.rndi(20, 35),
                );

                let pos = new Position(
                    this.passion.math.rndi(0, this.passion.system.width - size.x),
                    this.passion.math.rndi(0, this.passion.system.height - size.y),
                );

                const newBody = new Body(this.passion, pos, size);
                if (!bodies.some(b => b.intersects(newBody))) {
                    bodies.push(newBody);
                    break;
                }
            }
        }

        return bodies;
    }

    placeToFreeSpace(player: Body, bodies: Body[]) {
        const offset = 15;

        for (let i = 0; i < 150; i++) {
            player.pos = new Position(
                this.passion.math.rndi(offset, this.passion.system.width - player.size.x - offset),
                this.passion.math.rndi(offset, this.passion.system.height - player.size.y - offset),
            )

            if (!bodies.some(b => b.intersects(player))) {
                break;
            }
        }
    }
}
