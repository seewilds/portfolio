import { Invader } from "./invader.js";
import { ShieldSprite, characterConstants } from "./sprites.js";
import { Defender } from "./defender.js";
import { Laser } from "./laser.js";
import { Shield } from "./shield.js";
class Battlefield {
    constructor(context, renderOptions, level, levelState) {
        this.addShots = (laser) => {
            this.laserShots = [...this.laserShots, laser];
        };
        this.renderOptions = renderOptions;
        this.gameId = 0;
        this.levelNumber = 0;
        this.levelState = levelState;
        this.level = level;
        this.invaders = new Array();
        const audioPrimaryUrl = new URL("./../audio/fastinvader1.wav", import.meta.url);
        this.invaderPrimarySound = new Audio(audioPrimaryUrl.toString());
        this.invaderPrimarySound.volume = 0.25;
        const audioAltUrl = new URL("./../audio/fastinvader2.wav", import.meta.url);
        this.invaderAltSound = new Audio(audioAltUrl.toString());
        this.invaderAltSound.volume = 0.25;
        this.soundIsPrimary = true;
        this.direction = 1;
        this.invaderDeltaX = 6 / (this.renderOptions.targetFramesPerSecond / 30);
        this.deltaX = this.invaderDeltaX;
        this.deltaY = 0;
        this.invaderUpdateDelta =
            240 / (this.renderOptions.targetFramesPerSecond / 30);
        this.context = context;
        this.laserShots = [];
        this.shields = [];
        this.headerFooterPercentage = 0.1;
        this.dimensions = {
            height: this.context.canvas.height,
            width: this.context.canvas.width,
        };
        this.invaderRow = new Array(this.level.setup.length);
        this.defender = new Defender(this.context, this.renderOptions, {
            x: this.context.canvas.width,
            y: this.context.canvas.height -
                Math.floor(this.context.canvas.height * this.headerFooterPercentage),
        }, this.addShots);
        this.pauseSeconds = 0;
    }
    clear() {
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }
    playInvaderMoveSound() {
        if (this.soundIsPrimary) {
            this.invaderPrimarySound.play();
        }
        else {
            this.invaderAltSound.play();
        }
        this.soundIsPrimary = !this.soundIsPrimary;
    }
    setupLevel() {
        this.levelState.numberOfInvaders = this.level.setup.reduce((accum, row) => row.count + accum, 0);
        for (let i = 0; i < this.invaderRow.length; i++) {
            this.invaderRow[i] = this.setupInvaders(this.level.setup[i], i);
        }
        for (let i = 0; i < this.invaderRow[this.invaderRow.length - 1].length; i++) {
            this.invaderRow[this.invaderRow.length - 1][i].canFire = true;
        }
        this.shields = this.setupShields(this.level);
        this.defender.addEventListeners();
        this.levelState.initialized = true;
    }
    teardownLevel() {
        this.defender.removeEventListeners();
    }
    getHorizontalSpace(sprite, numberInRow) {
        let invaderWidth = sprite.cols * this.renderOptions.scale;
        numberInRow =
            numberInRow * invaderWidth > this.context.canvas.width
                ? Math.floor(this.context.canvas.width / invaderWidth)
                : numberInRow;
        let remainder = this.context.canvas.width - invaderWidth * numberInRow;
        return Math.floor(remainder / (numberInRow + 1));
    }
    setupInvaders(invaderRow, row) {
        let invaders = new Array(invaderRow.count);
        let topOffset = Math.floor(this.context.canvas.height * this.headerFooterPercentage);
        let spaceBetween = this.getHorizontalSpace(invaderRow.sprite, invaderRow.count);
        let invaderWidth = invaderRow.sprite.cols * this.renderOptions.scale;
        let invaderHeight = invaderRow.sprite.rows * this.renderOptions.scale +
            this.renderOptions.scale * this.renderOptions.scale;
        for (let i = 0; i < invaders.length; i++) {
            invaders[i] = new Invader(this.context, this.renderOptions, invaderRow.sprite, {
                x: i * (invaderWidth + spaceBetween) + spaceBetween,
                y: row * invaderHeight + topOffset,
            }, 0, invaderRow.colour, this.addShots);
        }
        return invaders;
    }
    setupShields(level) {
        let shields = new Array(level.shieldCount);
        let spaceBetween = this.getHorizontalSpace(ShieldSprite, level.shieldCount);
        let shieldWidth = ShieldSprite.cols * this.renderOptions.scale;
        for (let i = 0; i < level.shieldCount; i++) {
            shields[i] = new Shield(this.context, this.renderOptions, {
                x: i * (shieldWidth + spaceBetween) + spaceBetween,
                y: Math.floor(this.context.canvas.height * 0.72),
            });
        }
        return shields;
    }
    anyAtRightEdge() {
        for (let i = 0; i < this.invaderRow.length; i++) {
            for (let j = 0; j < this.invaderRow[i].length; j++) {
                if (this.invaderRow[i][this.invaderRow[i].length - 1].pixels.some((pixel) => pixel.x >= this.dimensions.width)) {
                    return true;
                }
            }
        }
        return false;
    }
    anyAtLeftEdge() {
        for (let i = 0; i < this.invaderRow.length; i++) {
            for (let j = 0; j < this.invaderRow[i].length; j++) {
                if (this.invaderRow[i][0].pixels.some((pixel) => pixel.x <= 0)) {
                    return true;
                }
            }
        }
        return false;
    }
    updateInvaders(timestamp) {
        this.removeInvaders();
        let topOfDefender = this.defender.getBoundingBox()[0].y;
        let atLeftBoundary = this.anyAtLeftEdge();
        let atRightBoundary = this.anyAtRightEdge();
        let invaderMoved = false;
        for (let i = 0; i < this.invaderRow.length; i++) {
            for (let j = 0; j < this.invaderRow[i].length; j++) {
                invaderMoved = this.invaderRow[i][j].update(timestamp, atLeftBoundary, atRightBoundary);
                this.updateInvadersConsumeShields(this.invaderRow[i][j]);
                if (this.invaderRow[i][j].getBoundingBox()[1].y >= topOfDefender) {
                    this.levelState.lives = 0;
                }
            }
        }
        if (invaderMoved) {
            this.playInvaderMoveSound();
        }
        this.enableLasers();
    }
    invadersFire() {
        this.invaderRow.forEach((invaders) => invaders.forEach((invader) => invader.fire()));
    }
    updateInvadersConsumeShields(invader) {
        for (let k = 0; k < this.shields.length; k++) {
            for (let l = this.shields[k].pixels.length - 1; l >= 0; l--) {
                if (invader.isPixelInBoundingBox(this.shields[k].pixels[l])) {
                    this.shields[k].pixels.splice(l, 1);
                }
            }
        }
    }
    updateShields() {
        for (let i = this.shields.length - 1; i >= 0; i--) {
            if (!this.shields[i].isActive()) {
                this.removeShield(i);
            }
            else {
                this.shields[i].update();
            }
        }
    }
    updateLasers(deltaTimestampSeconds) {
        this.laserShots.forEach((shot) => {
            shot.update(deltaTimestampSeconds / 1000);
        });
    }
    reset() {
        for (let i = this.laserShots.length - 1; i >= 0; i--) {
            this.removeLaserShot(i);
        }
        this.defender.clear();
        this.defender.reset();
        this.pauseSeconds = 0;
    }
    updateHits() {
        this.invaderRow.forEach((invaders) => {
            for (let i = invaders.length - 1; i >= 0; i--) {
                for (let j = this.laserShots.length - 1; j >= 0; j--) {
                    if (this.laserShots[j].direction < 0 &&
                        invaders[i].processLaser(this.laserShots[j])) {
                        this.removeLaserShot(j);
                        this.levelState.points += 10 + (4 % (i + 1)) * 10;
                    }
                }
            }
        });
        for (let i = this.shields.length - 1; i >= 0; i--) {
            for (let j = this.laserShots.length - 1; j >= 0; j--) {
                if (this.shields[i].hit(this.laserShots[j])) {
                    this.removeLaserShot(j);
                }
            }
        }
        if (this.defender.health > 0) {
            for (let i = 0; i < this.laserShots.length; i++) {
                if (this.defender.hit(this.laserShots[i])) {
                    this.levelState.lives -= 1;
                    this.defender.health = 0;
                }
            }
        }
        for (let j = this.laserShots.length - 1; j >= 0; j--) {
            if (this.laserShots[j].pixels.some((pixel) => {
                return (pixel.y < this.dimensions.height * this.headerFooterPercentage ||
                    pixel.y > this.dimensions.height * (1 - this.headerFooterPercentage));
            })) {
                this.removeLaserShot(j);
            }
        }
    }
    removeInvader(row, col) {
        this.invaderRow[row][col].clear();
        this.invaderRow[row].splice(col, 1);
        this.invaderUpdateDelta -=
            2 * (this.renderOptions.targetFramesPerSecond / 30);
    }
    removeInvaders() {
        for (let i = this.invaderRow.length - 1; i >= 0; i--) {
            for (let j = this.invaderRow[i].length - 1; j >= 0; j--) {
                if (this.invaderRow[i][j].health === 0 &&
                    this.invaderRow[i][j].pixelsHoldSeconds >= 0.25) {
                    this.removeInvader(i, j);
                    this.levelState.numberOfInvaders--;
                }
            }
        }
    }
    enableLasers() {
        this.invaderRow.forEach((invaders) => invaders.forEach((invader) => invader.health > 0 && invader.setCanFire(this.invaderRow)));
    }
    removeShield(index) {
        this.shields[index].clear();
        this.shields.splice(index, 1);
    }
    removeLaserShot(index) {
        this.laserShots[index].clear();
        this.laserShots.splice(index, 1);
    }
    runLevel(deltaTimestamp) {
        if (this.defender.health > 0) {
            this.updateHits();
            this.updateLasers(deltaTimestamp);
            this.defender.update(deltaTimestamp / 1000);
            this.updateInvaders(deltaTimestamp / 1000);
            this.updateShields();
            this.invadersFire();
        }
        else {
            if (this.pauseSeconds <= 0.8) {
                this.pauseSeconds += deltaTimestamp / 1000;
                this.defender.update(1);
            }
            else {
                this.reset();
            }
        }
        this.levelState.running =
            this.levelState.numberOfInvaders > 0 && this.levelState.lives > 0;
        if (!this.levelState.running) {
            this.teardownLevel();
        }
        return this.levelState;
    }
}
export { Battlefield };
//# sourceMappingURL=battlefield.js.map