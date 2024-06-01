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
        const audioUrl = new URL('./../audio/invaderkilled.wav', import.meta.url);
        this.explosionSound = new Audio(audioUrl.toString());
        this.explosionSound.volume = 0.25;
        this.altActive = false;
    }
    clear() {
        this.pixels.forEach(pixel => {
            pixel.Update(this.context, pixel.x, pixel.y, "black");
        });
    }
    hit(laser) {
        if (this.health === 0) {
            return false;
        }
        for (let i = 0; i < this.pixels.length; i++) {
            for (let j = 0; j < laser.pixels.length - 1; j++) {
                if (Math.abs(laser.pixels[j].x - this.pixels[i].x) <= 2 && Math.abs(laser.pixels[j].y - this.pixels[i].y) <= 2) {
                    this.health = 0;
                    this.clear();
                    this.switchSprite();
                    this.pixelsHoldSeconds = 0;
                    this.explosionSound.play();
                    return true;
                }
            }
        }
        return false;
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
            changeX = Math.floor(this.pixelMovementPerSecond * this.pixelsHoldSeconds) * this.direction;
            this.pixelsHoldSeconds = 0;
            invaderMoved = true;
        }
        this.x += changeX;
        this.y += changeY;
        this.pixels.forEach(pixel => {
            pixel.Update(this.context, pixel.x += changeX, pixel.y += changeY, this.colour);
        });
        if (this.health > 0 && this.canFire) {
            this.fire();
        }
        if (this.firstRender) {
            this.direction = 1;
        }
        this.firstRender = false;
        return invaderMoved;
    }
    fire() {
        if (Math.random() >= 0.99) {
            this.addShot(new Laser(this.context, this.renderOptions, { x: this.pixels[this.sprite.laserPosition].x, y: this.pixels[this.sprite.laserPosition].y }, 1, 'rgb(255,15,0)'));
        }
    }
    setCanFire(pixels) {
        for (let i = 0; i < pixels.length; i++) {
            if (this.pixels.some(pixel => pixel.y === pixels[i].y)) {
                this.canFire = true;
                return true;
            }
        }
        return false;
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
}
export { Invader };
//# sourceMappingURL=invader.js.map