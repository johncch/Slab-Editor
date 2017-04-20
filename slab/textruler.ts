export class TextRuler {
    element: HTMLSpanElement
    constructor() {
        this.element = document.createElement("span")
        this.element.classList.add("editor-text-ruler");
        // this.element.style.display = "none";
        this.element.style.left = "-5000px";
        this.element.style["white-space"] = "pre-wrap";
    }

    adapt(el: HTMLDivElement) {
        const style = getComputedStyle(el);
        this.element.style["font-family"] = style.getPropertyValue("font-family");
        this.element.style["font-size"] = style.getPropertyValue("font-size");
        this.element.style["font-weight"] = style.getPropertyValue("font-weight");
        this.element.style["line-height"] = style.getPropertyValue("line-height");
        this.element.style.padding = style.getPropertyValue("padding");
        this.element.style.margin = style.getPropertyValue("margin");
        this.element.style["max-width"] = el.offsetWidth;
    }

    text(text: string) {
        this.element.textContent = text;
    }

    get numberOfLines(): number {
        const style = getComputedStyle(this.element);
        const lineHeight = parseInt(style.getPropertyValue("line-height"), 10);
        return Math.round(this.element.offsetHeight / lineHeight);
    }

    get width(): number {
        return this.element.offsetWidth;
    }

    get height(): number {
        return this.element.offsetHeight;
    }
}
