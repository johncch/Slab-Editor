import { EventEmitter } from "./events";

export enum ChangeType {
    Insert, InsertLine, Remove, RemoveLine,
}

export class Document extends EventEmitter {

    // id: string;
    // title: string;
    contents: string[] = [];

    constructor(text: string = "") {
        super();
        this.contents = text.split(/\n/);
    }

    get numLines(): number {
        return this.contents.length
    }

    lineAt(index: number): string {
        if (index < this.contents.length && index >= 0) {
            return this.contents[index];
        }
        return null;
    }

    addLine(line, origin) {
        this.contents.splice(line, 0, "");
        this.emit("change", {
            type: ChangeType.InsertLine,
            line,
            origin,
        });
    }

    removeLine(line, origin) {
        this.contents.splice(line, 1);
        this.emit("change", {
            type: ChangeType.RemoveLine,
            line,
            origin,
        });
    }

    insert(line: number, col: number, data: string, origin) {
        if (data === "") {
            return;
        }
        const lineContent = this.contents[line] || "";
        this.contents[line] = lineContent.substr(0, col) + data +
            lineContent.substr(col);
        this.emit("change", {
            type: ChangeType.Insert,
            line,
            col,
            data,
            newContent: this.contents[line],
            oldContent: lineContent,
            origin,
        });
    }

    remove(line: number, col: number, data: string, origin) {
        if (data.length === 0) {
            return;
        }

        const lineContent = this.contents[line];
        const length = data.length;
        this.contents[line] = lineContent.substr(0, col) +
            lineContent.substr(col + length);
        this.emit("change", {
            type: ChangeType.Remove,
            line,
            col,
            data,
            newContent: this.contents[line],
            oldContent: lineContent,
            origin,
        });
    }

    toString() {
        return this.contents.join("\n");
    }
}
