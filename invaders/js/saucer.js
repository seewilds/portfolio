import { Pixel } from "./pixel.js";
import { Saucer } from "./sprites.js";
import { spriteFactory } from "./factories.js";
class Spaceship {
    constructor(context, renderOptions, position, colour) {
        this.context = context;
        this.sprite = Saucer;
        this.colour = colour;
        this.pixelMovementPerSecond = 200;
        this.directionX = 1;
        this.directionY = 1;
        this.direction = 0;
        this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, renderOptions.scale, position.x, position.y, this.sprite.pixels, this.colour);
    }
    clear(colour = "black") {
        this.pixels.forEach((pixel) => {
            pixel.Update(this.context, pixel.x, pixel.y, colour);
        });
    }
    getPosition() {
        // left, right, top, bottom
        return [this.pixels[40], this.pixels[55], this.pixels[0], this.pixels[62]];
    }
    setDirections(directionX, directionY) {
        this.directionX = directionX;
        this.directionY = directionY;
    }
    setColour(colour) {
        this.colour = colour;
    }
    update(secondsElapsed) {
        this.clear();
        let changeX = this.directionX *
            Math.floor(this.pixelMovementPerSecond * secondsElapsed);
        let changeY = this.directionY *
            Math.floor(this.pixelMovementPerSecond * secondsElapsed);
        this.pixels.forEach((pixel) => {
            pixel.Update(this.context, (pixel.x += changeX), (pixel.y += changeY), this.colour);
        });
    }
}
export { Spaceship };
//# sourceMappingURL=saucer.js.map