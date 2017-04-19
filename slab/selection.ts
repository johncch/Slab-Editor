export class Marker {
    line = 0;
    col = 0;

    constructor(line: number = 0, col: number = 0) {
        this.line = line;
        this.col = col;
    }

    set(line: number, col: number) {
        this.line = line;
        this.col = col;
    }

    greaterThanOrEqual(marker: Marker): boolean {
        return this.line >= marker.line && this.col >= marker.col;
    }
}

export class Selection {
    anchor = new Marker();
    focus = new Marker();

    set(line: number, col: number) {
        this.anchor.set(line, col)
        this.focus.set(line, col);
    }

    get isCollapsed() {
        return this.anchor.line === this.focus.line &&
                this.anchor.col === this.focus.col;
    }

    get isInverted() {
        return (this.anchor.line > this.focus.line) ||
            (this.anchor.line === this.focus.line &&
            this.anchor.col > this.focus.col);
    }

    // parameters:
    //      start: false, move to head
    //      noDir: false, maintain direction
    collapse(start: boolean = false, noDir: boolean = false) {
        const inverted = this.isInverted

        if (!noDir || !inverted) { // if not directionless or not inverted i.e. normally
            if (start) {
                // move focus to anchor
                this.focus.line = this.anchor.line;
                this.focus.col = this.anchor.col;
            } else {
                // move anchor to focus
                this.anchor.line = this.focus.line;
                this.anchor.col = this.focus.col;
            }
        } else {
            if (start) {
                // move anchor to focus
                this.anchor.line = this.focus.line;
                this.anchor.col = this.focus.col;
            } else {
                // move focus to anchor
                this.focus.line = this.anchor.line;
                this.focus.col = this.anchor.col;
            }
        }
    }
}