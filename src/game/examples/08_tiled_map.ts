import type { ImageIndex } from "../../passion/constants";
import type { Passion } from "../../passion/passion";
import { Animation, AnimationGrid } from "../../passion/stdlib/animation";
import { Position } from "../../passion/stdlib/position";
import type { IMap } from "../../passion/stdlib/tiled/tiledTypes";
import type { IGameExample } from "./example";

type Direction = 'up' | 'down' | 'left' | 'right';
type CarColor = 'red' | 'green' | 'taxi';

type CarSpawnPoint = {
    pos: Position;
    direction: Direction;
};

class Car {
    private passion: Passion;
    private image: ImageIndex;

    private pos: Position;
    private direction: Position;
    private speed = 50;

    private spriteParams: { uv: Position, wh: Position };
    
    constructor(passion: Passion, image: ImageIndex, point: CarSpawnPoint) {
        this.passion = passion;
        this.image = image;
        this.pos = point.pos.clone();
        this.direction = this.calculateDirectionVector(point.direction);
        this.spriteParams = this.calculateSpriteParams(point.direction);
    }

    update(dt: number) {
        const delta = this.direction.multiple(this.speed * dt);
        this.pos = this.pos.add(delta);
    }

    draw() {
        this.passion.graphics.blt(
            this.pos.x, this.pos.y, this.image,
            this.spriteParams.uv.x, this.spriteParams.uv.y,
            this.spriteParams.wh.x, this.spriteParams.wh.y,
        );
    }

    private calculateDirectionVector(direction: Direction): Position {
        switch (direction) {
            case 'up':
                return new Position(0, -1);
            case 'down':
                return new Position(0, 1);
            case 'left':
                return new Position(-1, 0);
            case 'right':
                return new Position(1, 0);
            default:
                return new Position(0, 0);
        }
    }

    private calculateSpriteParams(direction: Direction): { uv: Position, wh: Position } {
        const carColor = this.passion.math.choice(['red', 'taxi'] as CarColor[]);
        if (carColor === 'red') {
            return this.getRedCarSpriteParams(direction);
        }
        if (carColor === 'green') {
            return this.getGreenCarSpriteParams(direction);
        }
        return this.getTaxiSpriteParams(direction);
    }

    private getRedCarSpriteParams(direction: Direction): { uv: Position, wh: Position } {
        if (direction === 'up') {
            return {
                uv: new Position(320, 256),
                wh: new Position(16, 32),
            }
        }
        if (direction === 'down') {
            return {
                uv: new Position(272, 256),
                wh: new Position(16, 32),
            }
        }
        if (direction === 'left') {
            return {
                uv: new Position(240, 256),
                wh: new Position(32, 32),
            }
        }
        return {
            uv: new Position(288, 256),
            wh: new Position(32, 32),
        }
    }

    private getGreenCarSpriteParams(direction: Direction): { uv: Position, wh: Position } {
        if (direction === 'up') {
            return {
                uv: new Position(352, 224),
                wh: new Position(16, 32),
            }
        }
        if (direction === 'down') {
            return {
                uv: new Position(336, 224),
                wh: new Position(16, 32),
            }
        }
        if (direction === 'left') {
            return {
                uv: new Position(336, 256),
                wh: new Position(32, 16),
            }
        }
        return {
            uv: new Position(336, 272),
            wh: new Position(32, 16),
        }
    }

    private getTaxiSpriteParams(direction: Direction): { uv: Position, wh: Position } {
        if (direction === 'up') {
            return {
                uv: new Position(320, 224),
                wh: new Position(16, 32),
            }
        }
        if (direction === 'down') {
            return {
                uv: new Position(272, 224),
                wh: new Position(16, 32),
            }
        }
        if (direction === 'left') {
            return {
                uv: new Position(240, 224),
                wh: new Position(32, 32),
            }
        }
        return {
            uv: new Position(288, 224),
            wh: new Position(32, 32),
        }
    }
}

class Player {
    private passion: Passion;
    private pos: Position;
    private size: Position = new Position(16, 16);
    private image: ImageIndex;
    private speed = 40;
    private lastDirection: Direction = 'down';

    private animations: Map<Direction, Animation> = new Map();

    constructor(passion: Passion, pos: Position, image: ImageIndex) {
        this.passion = passion;
        this.pos = pos;
        this.image = image;

        const animSpeed = 0.15;
        const grid = new AnimationGrid(this.size.x, this.size.y);
        this.animations.set('up', new Animation(grid.range('26', '11,10,12,10'), animSpeed));
        this.animations.set('down', new Animation(grid.range('25', '11,10,12,10'), animSpeed));
        this.animations.set('left', new Animation(grid.range('24', '11,10,12,10'), animSpeed));
        this.animations.set('right', new Animation(grid.range('27', '11,10,12,10'), animSpeed));
    }

    update(dt: number) {
        const direction = this.control(dt);

        if (direction) {
            this.animations.get(direction)?.update(dt);
            this.lastDirection = direction;
        }
    }

    draw() {
        this.animations.get(this.lastDirection)?.draw(this.passion, this.pos.x, this.pos.y, this.image);
    }

    private control(dt: number): Direction | undefined {
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

        if (this.pos.x < 0) {
            this.pos.x = 0;
        }
        else if (this.pos.x + this.size.x > this.passion.system.width) {
            this.pos.x = this.passion.system.width - this.size.x;
        }
        if (this.pos.y < 0) {
            this.pos.y = 0;
        }
        else if (this.pos.y + this.size.y > this.passion.system.height) {
            this.pos.y = this.passion.system.height - this.size.y;
        }

        if (delta.x < 0) {
            return 'left';
        }
        if (delta.x > 0) {
            return 'right';
        }
        if (delta.y < 0) {
            return 'up';
        }
        if (delta.y > 0) {
            return 'down';
        }
        return undefined;
    }
}

class Scene {
    private passion: Passion;
    private image: ImageIndex;

    private map: IMap;

    private carSpawnPoints: CarSpawnPoint[] = [];
    private cars: Car[] = [];
    private carTimer: number = 0;

    private player: Player;

    constructor(passion: Passion, image: ImageIndex, map: IMap) {
        this.passion = passion;
        this.image = image;
        this.map = map;
        for (const point of this.map.getObjectsByType('car')) {
            this.carSpawnPoints.push({
                pos: new Position(point.x, point.y),
                direction: point.properties['direction'] as Direction
            });
        }

        const playerSpawnPoint = this.map.getObjectsByType('player')[0];
        this.player = new Player(this.passion, new Position(playerSpawnPoint.x, playerSpawnPoint.y), this.image);
    }

    update(dt: number) {
        this.map.update(dt);
        for (const car of this.cars) {
            car.update(dt);
        }

        this.carTimer -= dt;
        if (this.carTimer <= 0) {
            this.generateCar();
            this.carTimer = this.passion.math.rndi(3, 6);
        }

        this.player.update(dt);
    }

    draw() {
        this.map.draw(0, 0);
        for (const car of this.cars) {
            car.draw();
        }

        this.player.draw();
    }

    generateCar() {
        const point = this.passion.math.choice(this.carSpawnPoints);
        this.cars.push(new Car(this.passion, this.image, point));
    }
}

export class Example08 implements IGameExample {
    private passion: Passion;

    private scene?: Scene;
    private image: ImageIndex = '';

    constructor(passion: Passion) {
        this.passion = passion;
    }

    update(dt: number): void {
        this.scene?.update(dt);
    }

    draw(): void {
        this.passion.graphics.cls(0);
        this.scene?.draw();
    }

    onEnter() {
        this.passion.system.init(480, 368, 'Example 08: Tiled map');
        this.image = this.passion.resource.loadImage('./examples/tilesheet.png');
        this.passion.tiled.load('./examples/tilemap.tmx').then(map => this.scene = new Scene(this.passion, this.image, map));
    }

    onLeave() {

    }
}
