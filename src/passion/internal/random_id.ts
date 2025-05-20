export function generateUniqueName(prefix: string = 'res'): string {
    const random = Math.random().toString(36).slice(2, 8);
    const timestamp = Date.now().toString(36);
    return `${prefix}_${timestamp}_${random}`;
}