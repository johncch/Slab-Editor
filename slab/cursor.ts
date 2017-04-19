import { Style } from "./style";

export class Cursor {
    element: HTMLDivElement;
    textarea: HTMLTextAreaElement;
    style: Style;

    constructor(style: Style) {
        this.style = style;
        this.element = document.createElement("div");
        this.element.classList.add("editor-cursor");
        this.textarea = document.createElement("textarea");
        this.element.appendChild(this.textarea);        
    }

    focus() {
        this.textarea.focus();
    }

    attachTo(pos: { left: number, top: number }) {
        this.element.style.top = (this.style.padding.top + pos.top).toString();
        this.element.style.left = (this.style.padding.left + pos.left).toString();
    }

    show() {
        this.element.classList.remove("not-visible");
    }

    hide() {
        this.element.classList.add("not-visible");
    }
}