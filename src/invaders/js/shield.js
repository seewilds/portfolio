import { Pixel } from "./pixel.js";
import { spriteFactory } from "./factories.js";
import { Laser } from "./laser.js";
import { ShieldSprite } from "./sprites.js";
class Shield {
    constructor(context, renderOptions, position) {
        this.context = context;
        this.damage = [
            [0, 0],
            [-1, 1], [0, 1],
            [-2, 2], [0, 2],
            [-1, 3], [0, 3], [2, 3],
            [-2, 4], [-1, 4], [0, 4], [1, 4], [3, 4],
            [-2, 5], [-1, 5], [0, 5], [1, 5], [2, 5],
            [-1, 6], [0, 6], [1, 6], [2, 6], [3, 6],
            [-2, 7], [0, 7], [1, 7], [2, 7],
            [-1, 8], [1, 8]
        ];
        this.sprite = ShieldSprite;
        this.pix = [...ShieldSprite.pixels];
        this.scale = renderOptions.scale;
        this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.scale, position.x, position.y, this.pix, "#1FFE1F");
    }
    clear() {
        this.pixels.forEach(pixel => {
            pixel.Update(this.context, pixel.x, pixel.y, "black");
        });
    }
    hit(laser) {
        for (let i = 0; i < this.pixels.length; i++) {
            for (let j = 0; j < laser.pixels.length - 1; j++) {
                if (Math.abs(laser.pixels[j].x - this.pixels[i].x) <= 2 && Math.abs(laser.pixels[j].y - this.pixels[i].y) <= 2) {
                    this.explosion(i);
                    let firstPixelPosition = this.pix[0];
                    let x0 = this.pixels[0].x - this.scale * firstPixelPosition;
                    let y0 = this.pixels[0].y - this.scale * Math.floor(firstPixelPosition / this.sprite.cols);
                    this.clear();
                    this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.scale, x0, y0, this.pix, "#1FFE1F");
                    this.update();
                    return true;
                }
            }
        }
        return false;
    }
    explosion(index) {
        let hitIndex = this.pix[index];
        let pixelsToRemove = this.damage.map(d => this.damagedPixels(hitIndex, d));
        for (let i = this.pix.length - 1; i >= 0; i--) {
            if (pixelsToRemove.some(pixel => pixel === this.pix[i])) {
                this.pix.splice(i, 1);
            }
        }
        if (this.pix.length <= 40) {
            this.pix = [];
        }
    }
    damagedPixels(position, explosionPoition) {
        return position + explosionPoition[0] + this.sprite.cols * explosionPoition[1];
    }
    update() {
        this.pixels.forEach(pixel => {
            pixel.Update(this.context, pixel.x, pixel.y);
        });
    }
}
export { Shield };
//# sourceMappingURL=shield.js.map