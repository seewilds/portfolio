import { ascii } from "./characters.js";
import { Pixel } from "./pixel.js";
import { characterConstants } from "./sprites.js";
function spriteFactory(height, width, scale, xStart, yStart, pixels, colour) {
    let spriteArray = new Array(pixels.length);
    let activePixelsSet = 0;
    let loopNumber = 0;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (pixels.includes(loopNumber)) {
                spriteArray[activePixelsSet] = new Pixel(scale, scale, xStart + j * scale, yStart + scale * i, colour);
                activePixelsSet++;
            }
            loopNumber++;
        }
    }
    return spriteArray;
}
function textFactory(text, xStart, yStart, scale, colour, spacingOverride = characterConstants.cols) {
    let lettersArray = text.split('').map(char => ascii[char]);
    let letters = Array(lettersArray.length);
    for (let i = 0; i < lettersArray.length; i++) {
        letters[i] = spriteFactory(characterConstants.rows, characterConstants.cols, scale, xStart + i * scale * spacingOverride, yStart, lettersArray[i].pixels, colour);
    }
    return letters;
}
export { spriteFactory, textFactory };
//# sourceMappingURL=factories.js.map