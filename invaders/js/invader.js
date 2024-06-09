import { spriteFactory } from "./factories.js";
import { Laser } from "./laser.js";
import { Pixel } from "./pixel.js";
import { Explosion, characterConstants } from "./sprites.js";
class Invader {
    constructor(context, renderOptions, sprite, position, direction, colour, addShot) {
        this.health = 1;
        this.addShot = addShot;
        this.context = context;
        this.explosion = Explosion;
        this.canFire = false;
        this.sprite = sprite;
        this.colour = colour;
        this.direction = 0;
        this.renderOptions = renderOptions;
        this.x = position.x;
        this.y = position.y;
        this.pixelMovementPerSecond = 20;
        this.pixelsHoldSeconds = 0;
        this.firstRender = true;
        this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.renderOptions.scale, this.x, this.y, this.sprite.pixels, this.colour);
        const audioUrl = new URL("./../audio/invaderkilled.wav", import.meta.url);
        this.explosionSound = new Audio(audioUrl.toString());
        this.explosionSound.volume = 0.25;
        this.altActive = false;
    }
    clear() {
        this.pixels.forEach((pixel) => {
            pixel.Update(this.context, pixel.x, pixel.y, "black");
        });
    }
    update(secondsElapsed, atLeftBoundary, atRightBoundary) {
        let invaderMoved = false;
        let changeY = 0;
        let changeX = 0;
        this.clear();
        this.pixelsHoldSeconds += secondsElapsed;
        if (this.pixelsHoldSeconds >= 0.35 && this.health > 0) {
            this.switchSprite();
            if (atRightBoundary) {
                this.direction = -1;
                changeY = characterConstants.cols * 3;
            }
            if (atLeftBoundary) {
                this.direction = 1;
            }
            changeX =
                Math.floor(this.pixelMovementPerSecond * this.pixelsHoldSeconds) *
                    this.direction;
            this.pixelsHoldSeconds = 0;
            invaderMoved = true;
        }
        this.x += changeX;
        this.y += changeY;
        this.pixels.forEach((pixel) => {
            pixel.Update(this.context, (pixel.x += changeX), (pixel.y += changeY), this.colour);
        });
        if (this.firstRender) {
            this.direction = 1;
        }
        this.firstRender = false;
        return invaderMoved;
    }
    switchSprite() {
        if (this.health === 0) {
            this.colour = "rgb(249, 200, 14)";
            this.pixels = spriteFactory(this.explosion.rows, this.explosion.cols, this.renderOptions.scale, this.x, this.y, this.explosion.pixels, this.colour);
            this.altActive = false;
        }
        else if (this.altActive) {
            this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.renderOptions.scale, this.x, this.y, this.sprite.alternatePixels, this.colour);
            this.altActive = false;
        }
        else {
            this.pixels = spriteFactory(this.sprite.rows, this.sprite.cols, this.renderOptions.scale, this.x, this.y, this.sprite.pixels, this.colour);
            this.altActive = true;
        }
    }
    isLaserBlocked(invader) {
        let boundingBox = invader.getBoundingBox();
        return (this.pixels[this.sprite.laserPosition.laserXPosition].x >=
            boundingBox[0].x - 2 * this.renderOptions.scale &&
            this.pixels[this.sprite.laserPosition.laserXPosition].x <=
                boundingBox[1].x + 2 * this.renderOptions.scale);
    }
    setCanFire(invaderRows) {
        for (let i = 0; i < invaderRows.length; i++) {
            for (let j = 0; j < invaderRows[i].length; j++) {
                if (invaderRows[i][j].pixels[0] === this.pixels[0]) {
                    continue;
                }
                if (this.isLaserBlocked(invaderRows[i][j])) {
                    return false;
                }
            }
        }
        this.canFire = true;
        return true;
    }
    fire() {
        if (this.health > 0 && this.canFire && Math.random() >= 0.99) {
            this.addShot(new Laser(this.context, this.renderOptions, {
                x: this.pixels[this.sprite.laserPosition.laserXPosition].x,
                y: this.pixels[this.sprite.laserPosition.laserXPosition].y +
                    (this.sprite.laserPosition.rowsToBottom - 2) *
                        this.renderOptions.scale,
            }, 1, "rgb(255,15,0)"));
        }
    }
    processLaser(laser) {
        if (this.health === 0) {
            return false;
        }
        for (let j = 0; j < laser.pixels.length; j++) {
            if (this.isPixelInBoundingBox(laser.pixels[j])) {
                this.health = 0;
                this.clear();
                this.switchSprite();
                this.pixelsHoldSeconds = 0;
                this.explosionSound.play();
                return true;
            }
        }
        return false;
    }
    getBoundingBox() {
        let x0 = this.pixels[0].x - this.sprite.pixels[0] * this.renderOptions.scale;
        let y0 = this.pixels[0].y;
        let height = this.sprite.rows * this.renderOptions.scale;
        let width = this.sprite.cols * this.renderOptions.scale;
        return [
            { x: x0, y: y0 },
            { x: x0 + width, y: y0 + height },
        ];
    }
    isPixelInBoundingBox(pixel) {
        let boundingBox = this.getBoundingBox();
        return (pixel.x >= boundingBox[0].x &&
            pixel.x <= boundingBox[1].x &&
            pixel.y >= boundingBox[0].y &&
            pixel.y <= boundingBox[1].y);
    }
}
export { Invader };
//# sourceMappingURL=invader.js.map