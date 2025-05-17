export interface SubSystem {
    onBeforeAll(dt: number): void;
    onAfterAll(dt: number): void;
}
