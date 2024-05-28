import { Pixel } from "./pixel.js";
import { spriteFactory } from "./factories.js";
import { Shot } from "./sprites.js";
class Laser {
    constructor(context, renderOptions, position, direction, colour = "rgb(248, 102, 36)") {
        this.context = context;
        this.sprite = Shot;
        this.direction = direction;
        this.pixelMovementPerSecond = 300;
        this.colour = colour;
        this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, renderOptions.scale, position.x, position.y, this.sprite.pixels, this.colour);
    }
    update(secondsElapsed) {
        this.clear();
        let change = this.direction * Math.floor(this.pixelMovementPerSecond * secondsElapsed);
        this.pixels.forEach((pixel, index) => {
            pixel.Update(this.context, pixel.x, pixel.y += change, this.colour);
        });
    }
    clear() {
        this.pixels.forEach(pixel => {
            pixel.Update(this.context, pixel.x, pixel.y, "black");
        });
    }
}
export { Laser };
//# sourceMappingURL=laser.js.map