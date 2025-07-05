import { Font, Bitmap } from 'bdfparser';
import { Size } from '../stdlib/size';

export type BdfFontRenderCallback = (x: number, y: number) => void;

// More BDF fonts: https://github.com/olikraus/u8g2/tree/master/tools/font/bdf
export class BdfFont {
    private fontObj?: Font;

    static async createAsync(fontContent: string): Promise<BdfFont> {
        const font = new Font();
        async function* lines() { for (const line of fontContent.split(/\r?\n/)) yield line; }
        await font.load_filelines(lines());
        const instance = Object.create(BdfFont.prototype);
        instance.fontObj = font;
        return instance;
    }

    render(x: number, y: number, text: string, cb: BdfFontRenderCallback) {
        if (!this.fontObj) return;
        x = Math.ceil(x);
        y = Math.ceil(y);
        // Use bdfparser's draw method to get a Bitmap for the text
        const bitmap: Bitmap = this.fontObj.draw(text, {
            linelimit: Number.MAX_SAFE_INTEGER - 1
        });
        const bindata: string[] = bitmap.bindata;
        for (let row = 0; row < bindata.length; row++) {
            const bits = bindata[row];
            for (let col = 0; col < bits.length; col++) {
                if (bits[col] === '1') {
                    cb(x + col, y + row);
                }
            }
        }
    }

    getTextSize(text: string): Size {
        if (!this.fontObj) return new Size(0, 0);
        const bitmap: Bitmap = this.fontObj.draw(text, {
            linelimit: Number.MAX_SAFE_INTEGER - 1
        });
        const bindata: string[] = bitmap.bindata;
        const height = bindata.length;
        const width = bindata.reduce((max, row) => Math.max(max, row.length), 0);
        return new Size(width, height);
    }
}