import { characterConstants, Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, SPACE } from "./sprites.js";
import { Pixel } from "./pixel.js";
import { textFactory } from "./factories.js";
const ascii = {
    "0": Zero,
    "1": One,
    "2": Two,
    "3": Three,
    "4": Four,
    "5": Five,
    "6": Six,
    "7": Seven,
    "8": Eight,
    "9": Nine,
    "A": A,
    "B": B,
    "C": C,
    "D": D,
    "E": E,
    "F": F,
    "G": G,
    "H": H,
    "I": I,
    "J": J,
    "K": K,
    "L": L,
    "M": M,
    "N": N,
    "P": P,
    "O": O,
    "Q": Q,
    "R": R,
    "S": S,
    "T": T,
    "U": U,
    "V": V,
    "W": W,
    "X": X,
    "Y": Y,
    "Z": Z,
    " ": SPACE
};
class Text {
    constructor(context, scale, position, text, colour, spaceOverride = characterConstants.cols) {
        this.context = context;
        this.text = text;
        this.colour = colour;
        this.scale = scale;
        this.spaceOverride = spaceOverride;
        this.x = position.x;
        this.y = position.y;
        this.pixels = textFactory(this.text, this.x, this.y, this.scale, this.colour, this.spaceOverride);
    }
    clear(colour = "black") {
        this.pixels.forEach(pixels => {
            pixels.forEach(pixel => pixel.Update(this.context, pixel.x, pixel.y, colour));
        });
    }
    setText(text, colour = this.colour) {
        this.text = text;
        this.colour = colour;
        this.clear();
        this.pixels = textFactory(this.text, this.x, this.y, this.scale, this.colour, this.spaceOverride);
    }
    updateTextPosition(deltaX, deltaY, colour = this.colour) {
        this.clear();
        this.colour = colour;
        this.x += deltaX;
        this.y += deltaY;
        this.pixels = textFactory(this.text, this.x, this.y, this.scale, this.colour, this.spaceOverride);
        this.pixels.forEach(pixels => {
            pixels.forEach(pixel => pixel.Update(this.context, pixel.x, pixel.y));
        });
    }
}
export { ascii, Text };
//# sourceMappingURL=characters.js.map