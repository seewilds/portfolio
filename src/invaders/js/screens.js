import { Pixel } from "./pixel.js";
import { DefenderSprite, characterConstants } from "./sprites.js";
import { Text } from "./characters.js";
import { spriteFactory } from "./factories.js";
import { Spaceship } from "./saucer.js";
class TitleScreen {
    constructor(context, renderOptions) {
        this.context = context;
        this.renderOptions = renderOptions;
        this.startGame = 0;
        this.titleScale = this.renderOptions.scale;
        this.pressStartScale = this.renderOptions.scale / 2;
        this.spaceship = new Spaceship(this.context, this.renderOptions, { x: 5, y: 5 }, "silver");
        this.titleYStart = -100;
        this.titleYEnd = this.centreY("INVADERS FROM SPACE", this.titleScale) - characterConstants.rows * this.titleScale;
        this.titleYCurent = -100;
        this.titleOpacity = 1;
        this.title = new Text(this.context, this.renderOptions.scale, { x: this.centreX("INVADERS FROM SPACE", this.titleScale, 6), y: -100 }, "INVADERS FROM SPACE", "rgba(0, 255, 0, 1)", 6);
        this.pressStartFadeCurrent = 0;
        this.pressStartFadeStart = 0;
        this.pressStartFadeEnd = 0.8;
        this.pressStart = new Text(this.context, this.pressStartScale, { x: this.centreX("PRESS SPACE TO START", this.pressStartScale), y: this.centreY("PRESS SPACE TO START", this.pressStartScale) }, "PRESS SPACE TO START", `rgba(178, 34, 34, ${this.pressStartFadeCurrent})`);
        this.stars = this.setStars();
        window.addEventListener('keydown', (event) => this.handleSpace(event));
    }
    clear() {
        this.context?.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.fillStyle = "black";
        this.context?.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }
    centreX(text, scale, spacingOverride = characterConstants.cols) {
        return (this.context.canvas.width - (spacingOverride * scale * text.length)) / 2;
    }
    centreY(text, scale) {
        return (this.context.canvas.height - (characterConstants.rows * scale)) / 2;
    }
    update(timestamp) {
        this.updateStars();
        let begin = true;
        if (this.titleYCurent === this.titleYEnd) {
            this.updateSpaceship(timestamp);
        }
        if (this.startGame > 1) {
            begin = this.fadeOut(timestamp);
            window.removeEventListener('keydown', (event) => this.handleSpace(event));
        }
        else {
            this.updateTitle();
            this.updatePressStart();
        }
        return begin;
    }
    updateTitle() {
        if (this.titleYCurent < this.titleYEnd) {
            this.titleYCurent += 2;
            this.title.updateTextPosition(0, 2);
        }
    }
    updatePressStart() {
        if (this.titleYCurent != this.titleYEnd) {
            return;
        }
        if (this.pressStartFadeCurrent < this.pressStartFadeEnd) {
            this.pressStartFadeCurrent += 0.01;
            this.pressStart.updateTextPosition(0, 0, `rgba(178, 34, 34, ${this.pressStartFadeCurrent})`);
        }
        else {
            this.startGame = 1;
        }
    }
    updateSpaceship(timeStamp) {
        let position = this.spaceship.getPosition();
        if (position[1].x > this.context.canvas.width) {
            this.spaceship.directionX = -1 * this.spaceship.directionX;
        }
        if (position[2].y < 0 || position[3].y > this.context.canvas.height / 3) {
            this.spaceship.directionY = -1 * this.spaceship.directionY;
        }
        this.spaceship.setColour(`rgb(192,192,192, ${this.titleOpacity})`);
        this.spaceship.update(timeStamp / 1000);
    }
    setTextToFinal() {
        let remainder = 0;
        if (this.titleYCurent < 0) {
            remainder = this.titleYEnd + this.titleYCurent * -1;
        }
        else {
            remainder = this.titleYEnd - this.titleYCurent;
        }
        this.titleYCurent = this.titleYEnd;
        this.title.updateTextPosition(0, remainder);
        this.pressStartFadeCurrent = this.pressStartFadeEnd;
        this.pressStart.updateTextPosition(0, 0, `rgba(178, 34, 34, ${this.pressStartFadeEnd})`);
    }
    fadeOut(secondsElapsed) {
        if (this.titleOpacity > 0 || this.pressStartFadeCurrent > 0) {
            this.titleOpacity -= 0.01;
            this.pressStartFadeCurrent -= 0.01;
            this.title.updateTextPosition(0, 0, `rgba(0, 255, 0, ${this.titleOpacity})`);
            this.pressStart.updateTextPosition(0, 0, `rgba(205, 62, 81, ${this.pressStartFadeCurrent})`);
            this.updateSpaceship(secondsElapsed);
            return true;
        }
        this.clear();
        return false;
    }
    setStars() {
        let starPixels = [];
        for (let i = 0; i < 75; i++) {
            let pixel = new Pixel(this.renderOptions.scale, this.renderOptions.scale, Math.floor(Math.random() * (this.context.canvas.width)), Math.floor(Math.random() * (this.context.canvas.height)), "white");
            starPixels.push(pixel);
        }
        return starPixels;
    }
    updateStars() {
        this.stars.forEach(star => {
            star.Update(this.context, star.x, star.y);
        });
    }
    handleSpace(event) {
        if (event.key === " " && this.startGame === 0) {
            this.setTextToFinal();
        }
        this.startGame += 1;
    }
}
class TransitionScreen {
    constructor(context, renderOptions, mainText, subText, mainColour, subColour) {
        this.context = context;
        this.renderOptions = renderOptions;
        this.mainText = new Text(this.context, this.renderOptions.scale, { x: this.centreX(mainText, this.renderOptions.scale, 6), y: 200 }, mainText, mainColour, 6);
        this.subText = new Text(this.context, this.renderOptions.scale, { x: this.centreX(subText, this.renderOptions.scale, 6), y: 250 }, subText, subColour, 6);
    }
    updateMainText(text, colour) {
        this.mainText.x = this.centreX(text, this.renderOptions.scale);
        this.mainText.setText(text, colour);
    }
    updateSubText(text, colour) {
        this.subText.x = this.centreX(text, this.renderOptions.scale);
        this.subText.setText(text, colour);
    }
    clear() {
        this.mainText.updateTextPosition(0, 0, 'black');
        this.subText.updateTextPosition(0, 0, 'black');
    }
    draw() {
        this.mainText.updateTextPosition(0, 0);
        this.subText.updateTextPosition(0, 0);
    }
    centreX(text, scale, spacingOverride = characterConstants.cols) {
        return (this.context.canvas.width - (spacingOverride * scale * text.length)) / 2;
    }
}
class PlayerSection {
    constructor(context, renderOptions, level, lives) {
        this.context = context;
        this.renderOptions = renderOptions;
        this.level = level;
        this.lives = lives;
        this.defenderLives = new Array(this.lives);
        this.livesText = new Text(this.context, 3, { x: 10, y: 850 }, `${this.lives.toString()}`, "white");
        this.setupDefenderLives(this.lives);
    }
    setupDefenderLives(lives) {
        let startPixel = 80;
        for (let i = 0; i < lives; i++) {
            this.defenderLives[i] = spriteFactory(DefenderSprite.cols, DefenderSprite.rows, 3, startPixel, 850, DefenderSprite.pixels, "rgb(204, 218, 209)");
            startPixel += DefenderSprite.cols * this.renderOptions.scale + 25;
        }
    }
    clearDefenders() {
        this.defenderLives.forEach(pixels => pixels.forEach(pixel => {
            pixel.Update(this.context, pixel.x, pixel.y, "black");
        }));
    }
    draw(lives) {
        this.livesText.setText(lives.toString());
        this.livesText.updateTextPosition(0, 0);
        if (lives !== this.lives) {
            this.lives = lives;
            this.clearDefenders();
            this.setupDefenderLives(this.lives);
        }
        this.defenderLives.forEach((defender, index) => {
            defender.forEach(pixel => {
                pixel.Update(this.context, pixel.x, pixel.y);
            });
        });
    }
}
class ScoreBoard {
    constructor(context, renderOptions, level, lives) {
        this.context = context;
        this.renderOptions = renderOptions;
        this.level = level;
        this.lives = lives;
        this.hiPoints = 0;
        this.currentPoints = 0;
        this.currentScoreText = new Text(this.context, 2, { x: 10, y: 10 }, `CURRENT SCORE`, 'white');
        this.currentScore = new Text(this.context, 2, { x: 10, y: 40 }, `${this.currentPoints.toString()}`, 'white');
        this.hiScoreText = new Text(this.context, 2, { x: 250, y: 10 }, `HIGH SCORE`, 'white');
        this.hiScore = new Text(this.context, 2, { x: 250, y: 40 }, `${this.hiPoints.toString()}`, 'white');
    }
    updateScore(score) {
        this.currentScore.setText(score.toString());
    }
    draw(points) {
        this.currentPoints = points;
        this.currentScoreText.updateTextPosition(0, 0);
        this.currentScore.setText(this.currentPoints.toString());
        this.currentScore.updateTextPosition(0, 0);
        this.hiScoreText.updateTextPosition(0, 0);
        if (this.currentPoints >= this.hiPoints) {
            this.hiPoints = this.currentPoints;
            this.hiScore.setText(this.hiPoints.toString());
        }
        this.hiScore.updateTextPosition(0, 0);
    }
}
export { TitleScreen, ScoreBoard, PlayerSection, TransitionScreen };
//# sourceMappingURL=screens.js.map