class Pixel {
    constructor(width, height, x, y, colour) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.colour = colour;
    }
    Update(context, x, y, colour = this.colour) {
        this.x = x;
        this.y = y;
        this.colour = colour;
        context.fillStyle = this.colour;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}
export { Pixel };
//# sourceMappingURL=pixel.js.map