type BdfGlyph = {
    encoding: number;
    width: number;
    height: number;
    xOffset: number;
    yOffset: number;
    bitmap: number[];
};

export type BdfFontData = {
    glyphs: Map<number, BdfGlyph>;
    height: number;
    defaultWidth: number;
};

function parseBdf(bdfText: string): BdfFontData {
    const glyphs = new Map<number, BdfGlyph>();
    let lines = bdfText.split('\n');
    let i = 0;
    let fontHeight = 0;
    let defaultWidth = 8;
    let defaultXOffset = 0;
    let defaultYOffset = 0;

    while (i < lines.length) {
        if (lines[i].startsWith('FONTBOUNDINGBOX')) {
            let [w, h, xOffset, yOffset] = lines[i].split(/\s+/);
            defaultWidth = parseInt(w, 10);
            fontHeight = parseInt(h, 10);
            defaultXOffset = parseInt(xOffset);
            defaultYOffset = parseInt(yOffset);
        }
        if (lines[i].startsWith('STARTCHAR')) {
            let encoding = 0, width = defaultWidth, height = fontHeight, xOffset = defaultXOffset, yOffset = defaultYOffset, bitmap: number[] = [];
            while (!lines[i].startsWith('ENDCHAR')) {
                if (lines[i].startsWith('ENCODING')) encoding = parseInt(lines[i].split(' ')[1], 10);
                if (lines[i].startsWith('BBX')) {
                    let [, w, h, x, y] = lines[i].split(/\s+/);
                    width = parseInt(w, 10);
                    height = parseInt(h, 10);
                    xOffset = parseInt(x, 10);
                    yOffset = parseInt(y, 10);
                }
                if (lines[i].trim() === 'BITMAP') {
                    i++;
                    while (!lines[i].startsWith('ENDCHAR')) {
                        bitmap.push(parseInt(lines[i], 16));
                        i++;
                    }
                    break;
                }
                i++;
            }
            glyphs.set(encoding, { encoding, width, height, xOffset, yOffset, bitmap });
        }
        i++;
    }
    return { glyphs, height: fontHeight, defaultWidth };
}

export type BdfFontRenderCallback = (x: number, y: number) => void;

// More BDF fonts: https://github.com/olikraus/u8g2/tree/master/tools/font/bdf
export class BdfFont {
    private fontData: BdfFontData;

    constructor(fontContent: string) {
        this.fontData = parseBdf(fontContent);
    }

    render(x: number, y: number, text: string, cb: BdfFontRenderCallback) {
        x = Math.ceil(x);
        y = Math.ceil(y);
        let cx = x;
        for (const ch of text) {
            const code = ch.charCodeAt(0);
            const glyph = this.fontData.glyphs.get(code);
            if (glyph) {
                for (let row = 0; row < glyph.height; row++) {
                    let bits = glyph.bitmap[row] ?? 0;
                    for (let col = 0; col < glyph.width; col++) {
                        if ((bits >> (glyph.width + 1 - col)) & 1) {
                            cb(cx + col + glyph.xOffset, y + row + glyph.yOffset);
                        }
                    }
                }
                cx += glyph.width;
            } else {
                cx += this.fontData.defaultWidth;
            }
        }
    }
}