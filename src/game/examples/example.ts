export interface IGameExample {
    readonly exampleTitle: string;

    update(dt: number): void;
    draw(): void;

    onEnter(): void;
    onLeave(): void;
}
