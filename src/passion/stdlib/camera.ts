import type { Passion } from "../passion";
import { Position } from "./position";
import { Rect } from "./rect";

export type CameraDrawCallback = (left: number, top: number, width: number, height: number) => void;

export interface ICamera {
    readonly x: number;
    readonly y: number;
    readonly targetX: number;
    readonly targetY: number;

    readonly offsetX: number;
    readonly offsetY: number;

    update(dt: number): void;
    draw(callback: CameraDrawCallback): void;

    setWorld(left?: number, top?: number, width?: number, height?: number): void;
    getWorld(): Rect;

    setWindow(left: number, top: number, width: number, height: number): void;
    getWindow(): Rect;

    setSpeed(speed: number): void;

    setPosition(x: number, y: number): void;

    moveTo(x: number, y: number): void;
}

export class Camera implements ICamera {
    private passion: Passion;

    private world: Rect = new Rect();
    private window: Rect = new Rect();
    private position: Position = new Position();
    private target: Position = new Position();
    private speed: number = 5;

    constructor(passion: Passion, position: Position = new Position(), world: Rect = new Rect()) {
        this.passion = passion;
        this.position = position;
        this.world = world;
        this.window = new Rect(0, 0, this.passion.system.width, this.passion.system.height);

        this.clampPosition();
    }

    get x(): number {
        return this.position.x;
    }

    get y(): number {
        return this.position.y;
    }

    get targetX(): number {
        return this.target.x;
    }

    get targetY(): number {
        return this.target.y;
    }

    get offsetX(): number {
        return Math.ceil(this.position.x - this.window.width / 2);
    }

    get offsetY(): number {
        return Math.ceil(this.position.y - this.window.height / 2);
    }

    update(dt: number): void {
        if (this.target.x !== this.position.x || this.target.y !== this.position.y) {
            this.position.x = interpolate(this.position.x, this.target.x, dt, this.speed);
            this.position.y = interpolate(this.position.y, this.target.y, dt, this.speed);

            this.clampPosition();
        }
    }

    draw(callback: CameraDrawCallback): void {
        this.passion.graphics.camera();

        const viewportIsChanged = this.window.left > 0
            || this.window.top > 0
            || this.window.width < this.passion.system.width
            || this.window.height < this.passion.system.height;

        if (viewportIsChanged) {
            this.passion.graphics.clip(this.window.left, this.window.top, this.window.width, this.window.height);
        }

        this.passion.graphics.camera(this.offsetX, this.offsetY);

        callback(
            0, 0, 0, 0
        );

        this.passion.graphics.camera();
        if (viewportIsChanged) {
            this.passion.graphics.clip();
        }
    }

    setWorld(left?: number, top?: number, width?: number, height?: number): void {
        this.world = new Rect(left, top, width, height);
    }

    getWorld(): Rect {
        return Rect.fromRect(this.world);
    }

    setWindow(left: number, top: number, width: number, height: number): void {
        this.window = new Rect(left, top, width, height);
    }

    getWindow(): Rect {
        return Rect.fromRect(this.window);
    }

    setSpeed(speed: number): void {
        this.speed = speed;
    }

    setPosition(x: number, y: number): void {
        this.position.x = x;
        this.position.y = y;

        this.clampPosition();
    }

    moveTo(x: number, y: number): void {
        this.target.x = x;
        this.target.y = y;
    }

    private clampPosition() {
        if (this.world.width === 0 || this.world.height === 0) {
            return;
        }

        if (this.offsetX < this.world.left) {
            const delta = this.position.x - this.offsetX;
            this.position.x = this.world.left + delta;
        }
        if (this.offsetY < this.world.top) {
            const delta = this.position.y - this.offsetY;
            this.position.y = this.world.top + delta;
        }

        if (this.offsetX + this.window.width > this.world.right) {
            const delta = this.position.x - this.offsetX;
            this.position.x = this.world.right - delta;
        }
        if (this.offsetY + this.window.height > this.world.bottom) {
            const delta = this.position.y - this.offsetY;
            this.position.y = this.world.bottom - delta;
        }
    }
}

function interpolate(value: number, target: number, dt: number, speed: number): number {
    const dx = target - value;
    if (Math.abs(dx) > 0.01) {
        value += dx * Math.min(dt * speed, 1) + 0.25 * dx * Math.pow(Math.min(dt, 1), 2);
        if (Math.abs(target - value) < 0.01) {
            value = target;
        }
        return value;
    }
    return value;
}