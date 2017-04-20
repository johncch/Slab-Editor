import { INode } from "./formatter";
import { TextRuler } from "./textruler";
import * as Utils from "./utils";

export class PlainTextRenderer {

    textRuler: TextRuler;

    constructor(textRuler: TextRuler) {
        this.textRuler = textRuler;
    }

    build(lineNode: INode) {
        const text = lineNode.literal;
        const lineBreaker = new PlainTextLineBreaker(text);
        const lines = [];

        let nextWord = lineBreaker.getNextWord();
        let line = "";
        while (nextWord !== "") {
            const newLine = line + nextWord;
            this.textRuler.text(newLine);
            if (this.textRuler.numberOfLines > 1) {
                lines.push(line);
                line = nextWord;
            } else {
                line = newLine;
            }
            nextWord = lineBreaker.getNextWord();
        }
        lines.push(line);
        return { lines };
    }
}

// This is a näive line breaker that breaks only on spaces and hyphens.
class PlainTextLineBreaker {

    text: string;
    private index = 0;

    constructor(text: string) {
        this.text = text;
    }

    getNextWord(): string {
        if (this.index >= this.text.length - 1) {
            return "";
        }
        const startIndex = this.index;
        for (; this.index < this.text.length; this.index++) {
            const char = this.text.charAt(this.index);
            if (char === " " || char === "-") {
                break;
            }
        }
        const endIndex = this.index;
        this.index += 1;
        return this.text.substring(startIndex, endIndex + 1);
    }
}
