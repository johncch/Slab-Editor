export class Style {
    config = {
        lineHeightMultiplier: 1.5,
    }
    // Values
    padding = { top: 0, right: 0, bottom: 0, left: 0 };
    lineHeight: number;

    constructor(el: HTMLElement) {
        const style = getComputedStyle(el);
        // Paddings
        this.padding.top = parseInt(style.getPropertyValue("padding-top"), 10);
        this.padding.right = parseInt(style.getPropertyValue("padding-right"), 10);
        this.padding.bottom = parseInt(style.getPropertyValue("padding-bottom"), 10);
        this.padding.left = parseInt(style.getPropertyValue("padding-left"), 10);

        const fontSize = parseInt(style.getPropertyValue("font-size"), 10);
        const lineHeight = parseInt(style.getPropertyValue("line-height"), 10);
        this.lineHeight = (lineHeight || fontSize * this.config.lineHeightMultiplier);
        // ^ Line height is different from actual measure height
        // TODO actually measure the height of the line
    }

    normalizeX(x: number): number {
        return x - this.padding.left;
    }

    normalizeY(y: number): number {
        return y - this.padding.top;
    }
}