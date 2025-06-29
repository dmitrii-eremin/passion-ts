export interface IGameExample {
    update(dt: number): void;
    draw(): void;

    onEnter(): void;
    onLeave(): void;
}
