export class PassionData {
    public canvas: HTMLCanvasElement | null = null;
    public context: CanvasRenderingContext2D | null = null;

    isReady(): boolean {
        return this.canvas !== null && this.context !== null;
    }
}
