import { Cursor } from "./cursor";
import { ChangeType, Document } from "./document";
import { IFormatter, PlainTextFormatter } from "./formatter";
import { defaultKeyMap, IKeyMap } from "./keymap";
import { PlainTextRenderer } from "./renderer";
import { Marker, Selection } from "./selection";
import { Style } from "./style";
import { TextRuler } from "./textruler";
import * as Utils from "./utils";

export class SlabEditor {

    id: string = Utils.generateId();
    // model
    docObj: Document;
    // HTML Element
    canvas: HTMLElement;
    private contentDisplay: HTMLDivElement;
    private selectionDisplay: HTMLDivElement;
    // Other objects
    textRuler: TextRuler;
    cursor: Cursor;
    selection: Selection;
    keymap: IKeyMap;
    style: Style;
    formatter: IFormatter;
    renderer: PlainTextRenderer;

    constructor(element: HTMLElement, options: {
        keymap?: IKeyMap,
        source?: string,
    }) {
        this.canvas = element
        this.canvas.setAttribute("tabIndex", "0");
        this.canvas.style.position = "relative";
        this.canvas.style.userSelect = "none";
        this.canvas.innerHTML = "";

        this.style = new Style(element);
        this.setupElements();
        this.attachEventHandlers();

        options = options || {};
        this.keymap = options.keymap || defaultKeyMap();
        const source = options.source || "";
        this.load(source);
    }

    // Loads a document
    load(text: string = "") {
        this.contentDisplay.innerHTML = "";
        this.docObj = new Document(text);
        this.formatter = new PlainTextFormatter();
        this.renderer = new PlainTextRenderer(this.textRuler);
        this.renderDocument();
        this.docObj.on("change", this.handleDocObjChange.bind(this));
    }

    setupElements() {
        // Create text display
        this.contentDisplay = document.createElement("div");
        this.contentDisplay.classList.add("editor-list-display");
        this.canvas.appendChild(this.contentDisplay);

        this.selectionDisplay = document.createElement("div");
        this.selectionDisplay.classList.add("editor-selection-display");
        this.canvas.appendChild(this.selectionDisplay);

        this.textRuler = new TextRuler()
        this.textRuler.adapt(this.contentDisplay);
        this.canvas.appendChild(this.textRuler.element);

        this.cursor = new Cursor(this.style);
        this.cursor.attachTo({ left: 0, top: 0 });
        this.canvas.appendChild(this.cursor.element);
        this.cursor.focus();

        this.selection = new Selection();
    }

    attachEventHandlers() {
        this.contentDisplay.addEventListener("click", this.handleCanvasClick.bind(this));
        this.contentDisplay.addEventListener("dblclick", this.handleCanvasDblClick.bind(this));
        this.contentDisplay.addEventListener("mousedown", this.handleCanvasMouseDown.bind(this));
        this.contentDisplay.addEventListener("mouseup", this.handleCanvasMouseUp.bind(this));

        this.cursor.textarea.addEventListener("keydown", this.handleCommand.bind(this));
        this.cursor.textarea.addEventListener("input", this.handleKeyPress.bind(this));
        this.cursor.textarea.addEventListener("keyup", this.handleKeyPress.bind(this));
    }

    // Mouse methods

    cursorTimeout = -1;

    handleCanvasClick(e: MouseEvent) {
        Utils.log("[click]");
    }

    handleCanvasDblClick(e: MouseEvent) {
        Utils.log("[double click]");
        e.preventDefault();
        e.stopPropagation();
        if (this.cursorTimeout > -1) {
            clearTimeout(this.cursorTimeout);
        }
        this.canvas.focus();
    }

    handleCanvasMouseDown(e: MouseEvent) {
        Utils.log("[mouse down]");
        const coords = this.normalizeMouseCoordinates(e);
        const pos = this.locate(coords.x, coords.y);
        this.selection.anchor.set(pos.line, pos.col);
    }

    handleCanvasMouseUp(e: MouseEvent) {
        Utils.log("[mouse up]");
        const coords = this.normalizeMouseCoordinates(e);
        const pos = this.locate(coords.x, coords.y);
        this.selection.focus.set(pos.line, pos.col);
        this.renderSelection();
    }

    private normalizeMouseCoordinates(e: MouseEvent): { x: number, y: number} {
        const boundingRect = this.contentDisplay.getBoundingClientRect();
        const body = document.body;
        const scrollTop = window.pageYOffset || this.contentDisplay.scrollTop || body.scrollTop;
        const scrollLeft = window.pageXOffset || this.contentDisplay.scrollLeft || body.scrollLeft;
        const clientTop = this.contentDisplay.clientTop || body.clientTop || 0;
        const clientLeft = this.contentDisplay.clientLeft || body.clientLeft || 0;
        const y = e.pageY - (boundingRect.top + scrollTop - clientTop);
        const x = e.pageX - (boundingRect.left + scrollLeft - clientLeft);
        return {x, y};
    }

    // Keyboard shortcut methods

    commandTriggered = false;

    handleCommand(e: KeyboardEvent) {
        const command = {
            keycode: e.keyCode,
            alt: e.altKey,
            ctrl: e.ctrlKey,
            cmd: e.metaKey,
            shift: e.shiftKey,
        }
        const executed = this.keymap.execCommand(this, command);
        if (executed) {
            e.preventDefault();
            e.stopPropagation();
            this.renderSelection();
        }
        this.commandTriggered = executed;
    }

    handleKeyPress(e: KeyboardEvent) {
        if (this.commandTriggered) {
            this.commandTriggered = false;
            return;
        }
        const target = e.target;
        if (target instanceof HTMLTextAreaElement) {
            Utils.log(`[keypress] ${this.cursor.textarea.value}`);
            const insChar = target.value;
            if (insChar.length > 0) {
                if (!this.selection.isCollapsed) {
                    this.removeAndCollapse();
                }
                target.value = "";
                this.docObj.insert(this.selection.anchor.line, this.selection.anchor.col,   insChar, this.id);
            }
        }
    }

    focusInput() {
        this.cursorTimeout = -1;
        this.cursor.focus();
    }

    // Doc Obj handlers

    handleDocObjChange(e) {
        let changeMarker: Marker;
        switch (e.type) {
            case ChangeType.Insert:
                this.update(e.line);
                changeMarker = new Marker(e.line, e.col);
                if (this.selection.anchor.greaterThanOrEqual(changeMarker)) {
                    this.moveMarker(this.selection.anchor, e.data.length);
                }
                if (this.selection.focus.greaterThanOrEqual(changeMarker)) {
                    this.moveMarker(this.selection.focus, e.data.length);
                }
                this.renderSelection();
                break;
            case ChangeType.Remove:
                this.update(e.line);
                changeMarker = new Marker(e.line, e.col);
                if (this.selection.anchor.greaterThanOrEqual(changeMarker)) {
                    this.moveMarker(this.selection.anchor, -e.data.length);
                }
                if (this.selection.focus.greaterThanOrEqual(changeMarker)) {
                    this.moveMarker(this.selection.focus, -e.data.length);
                }
                this.renderSelection();
                break;
            case ChangeType.InsertLine:
                const newItem = this.createLineItem();
                const nextChild = this.contentDisplay.children[e.line]
                this.contentDisplay.insertBefore(newItem, nextChild);
                // TODO fix selection
                break;
            case ChangeType.RemoveLine:
                const lineItem = this.contentDisplay.children[e.line]
                lineItem.remove();
                // TODO fix selection
                break;
        }
    }

    // Selection methods - methods that affect selection or selection markers

    moveMarker(cursor: Marker, moveLen: number) {
        const numLines = this.docObj.numLines;
        let currentLine = this.docObj.lineAt(cursor.line);

        while (true) {
            const newCol = cursor.col + moveLen;
            if (newCol > currentLine.length) {
                // If the cursor needs to move over the current line length
                if ((numLines - 1) > cursor.line) {
                    // and the current line is less than the document length
                    cursor.line += 1;
                    cursor.col = 0;
                    moveLen = newCol - currentLine.length - 1; // compensate for the extra slot at the end
                    currentLine = this.docObj.lineAt(cursor.line);
                } else {
                    // else we move to the end
                    cursor.col = currentLine.length;
                    break;
                }
            } else if (newCol < 0) {
                // Else if we need to move back
                if (cursor.line > 0) {
                    // We go up a line
                    cursor.line -= 1;
                    currentLine = this.docObj.lineAt(cursor.line);
                    cursor.col = currentLine.length;
                    moveLen = newCol + 1;
                } else {
                    // else we move to the start
                    cursor.col = 0;
                    break;
                }
            } else {
                cursor.col = newCol;
                break;
            }
        }
    }

    moveMarkerLine(cursor: Marker, unit: number) {
        const curPos = this.measure(cursor.line, cursor.col);
        const curTop = curPos.top + unit * this.style.lineHeight;
        if (curTop >= 0)	{
            const pos = this.locate(curPos.left, curTop);
            cursor.line = pos.line;
            cursor.col = pos.col;
        }
    }

    moveMarkerToLineStart(cursor: Marker) {
        cursor.col = 0;
    }

    moveMarkerToLineEnd(cursor: Marker) {
        const lineItem = this.docObj.lineAt(cursor.line);
        cursor.col = lineItem.length + 1;
    }

    moveMarkerToRowStart(cursor: Marker) {
        const lineItem = this.contentDisplay.children[cursor.line] as HTMLElement;
        const stats = this.getLineStat(cursor.line)

        const lines = stats.lines;
        let offset = 0;
        for (const line of lines) {
            if (offset + line.length >= cursor.col) {
                cursor.col = offset;
                return;
            }
            offset += line.length;
        }
    }

    moveMarkerToRowEnd(cursor: Marker) {
        const lineItem = this.contentDisplay.children[cursor.line] as HTMLElement;
        const stats = this.getLineStat(cursor.line)

        const lines = stats.lines;
        let offset = 0;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (offset + line.length > cursor.col) {
                const tempLen = offset + line.length + ( i < (lines.length - 1) ? -1 : 0 );
                cursor.col = tempLen;
                return;
            }
            offset += line.length;
        }
    }

    selectAll() {
        const lastLineIndex = this.docObj.numLines - 1;
        this.selection.anchor.line = 0;
        this.selection.anchor.col = 0;
        this.selection.focus.line = lastLineIndex;
        this.selection.focus.col = this.docObj.lineAt(lastLineIndex).length;
    }

    // Content render methods

    private renderDocument() {
        this.contentDisplay.innerHTML = "";

        const numLines = this.docObj.numLines;
        for (const line of this.docObj.contents) {
            const formattedLine = this.formatter.format(line);
            const lineStat = this.renderer.build(formattedLine);
            const lineEl = this.createLineItem();
            const id = lineEl.getAttribute("id");
            this.lineStatCache.set(id, lineStat);
            for (const row of lineStat.lines) {
                const rowEl = this.createRowItem();
                rowEl.textContent = row;
                lineEl.appendChild(rowEl);
            }
            this.contentDisplay.appendChild(lineEl);
        }
    }

    private update(line: number, moveCursor = false) {
        // Clear the current line item
        const lineItem = this.contentDisplay.children[line]
        for (let i = lineItem.children.length - 1; i >= 0; i--) {
            const item = lineItem.children.item(i);
            item.remove();
        }
        // then rebuild it.
        const textData = this.docObj.lineAt(line);
        const formattedLine = this.formatter.format(textData);
        const lineStat = this.renderer.build(formattedLine);
        const id = lineItem.getAttribute("id");
        this.lineStatCache.set(id, lineStat);
        for (const row of lineStat.lines) {
            const rowEl = this.createRowItem();
            rowEl.textContent = row;
            lineItem.appendChild(rowEl);
        }
    }

    addLine() {
        if (!this.selection.isCollapsed) {
            this.removeAndCollapse();
        }
        const line = this.selection.anchor.line;
        const col = this.selection.anchor.col;
        const lineItem = this.docObj.lineAt(line);
        const moveText = lineItem.substr(col);
        this.docObj.remove(line, col, moveText, this.id);
        const newLine = line + 1;
        this.docObj.addLine(newLine, this.id);
        this.docObj.insert(newLine, 0, moveText, this.id);
    }

    delete(forward: boolean) {
        forward = forward || false;
        if (!this.selection.isCollapsed) {
            this.removeAndCollapse();
        } else {
            const line = this.selection.anchor.line;
            const col = this.selection.anchor.col;
            const text = this.docObj.lineAt(line)
            if (col === 0 && !forward) {
                if (line === 0) {
                    return; // already at the begining, can't delete
                }
                this.docObj.removeLine(line, this.id);
                const prevLine = line - 1;
                const prevItem = this.docObj.lineAt(prevLine)
                const prevItemLen = prevItem.length;
                this.docObj.insert(prevLine, prevItemLen, text, this.id);
            } else if (col === text.length && forward) {
                if (line === this.docObj.numLines - 1) {
                    return; // already at the end, can't delete
                }
                const nextLine = line + 1;
                const nextItemText = this.docObj.lineAt(nextLine);
                this.docObj.removeLine(nextLine, this.id);
                this.docObj.insert(line, text.length, nextItemText, this.id);
            } else {
                const delCol = col + (forward ? 0 : -1);
                const data = text.substr(delCol, 1);
                this.docObj.remove(line, delCol, data, this.id);
            }
        }
    }

    removeAndCollapse() {
        if (this.selection.isCollapsed) {
            return;
        }

        const inverted = this.selection.isInverted;
        const start = inverted ? this.selection.focus : this.selection.anchor;
        const end = inverted ? this.selection.anchor : this.selection.focus;

        const lineItem = this.contentDisplay.children[start.line]
        const text = lineItem.textContent;
        let data;
        if (start.line === end.line) {
            const len = end.col - start.col;
            data = text.substr(start.col, len);
            this.docObj.remove(start.line, start.col, data, this.id);
        } else {
            data = text.substr(start.col);
            this.docObj.remove(start.line, start.col, data, this.id);

            const endLineItem = this.contentDisplay.children[end.line]
            const endLineItemText = endLineItem.textContent;
            this.docObj.removeLine(end.line, this.id);

            let tempLine = end.line - 1;
            for (; tempLine > start.line; tempLine--) {
                this.docObj.removeLine(tempLine, this.id);
            }

            const insertData = endLineItemText.substr(end.col);
            this.docObj.insert(start.line, start.col, insertData, this.id);
        }
        this.selection.collapse(true, true);
    }

    // Renders the selection for the document
    private renderSelection() {
        this.selectionDisplay.innerHTML = "";
        if (this.selection.isCollapsed) {
            // The selection is single
            this.cursor.show();
            const pos = this.measure(this.selection.anchor.line, this.selection.anchor.col);
            this.cursor.attachTo(pos);
            this.cursor.focus();
        } else {
            // Render the selection cursor
            this.cursor.hide();
            const inverted = this.selection.isInverted;
            const start = inverted ? this.selection.focus : this.selection.anchor;
            const end = inverted ? this.selection.anchor : this.selection.focus;
            const sPos = this.measure(start.line, start.col);
            const ePos = this.measure(end.line, end.col);

            if (sPos.top === ePos.top) {
                this.drawSelection({
                    top: this.style.padding.top + sPos.top,
                    left: this.style.padding.left + sPos.left,
                    width: ePos.left - sPos.left,
                    height: this.style.lineHeight,
                })
            } else {
                this.drawSelection({
                    top: this.style.padding.top + sPos.top,
                    left: this.style.padding.left + sPos.left,
                    right: this.style.padding.right,
                    height: this.style.lineHeight,
                });
                let newTop = sPos.top + this.style.lineHeight;
                while (newTop < ePos.top) {
                    this.drawSelection({
                        top: this.style.padding.top + newTop,
                        left: this.style.padding.left,
                        right: this.style.padding.right,
                        height: this.style.lineHeight,
                    })
                    newTop = newTop + this.style.lineHeight;
                }
                this.drawSelection({
                    top: this.style.padding.top + ePos.top,
                    left: this.style.padding.left,
                    width: ePos.left,
                    height: this.style.lineHeight,
                });
            }
        }
    }

    private drawSelection(props: { top: number, left: number, right?: number, width?: number, height: number }) {
        const selectionDiv = document.createElement("div");
        selectionDiv.classList.add("editor-selection");
        selectionDiv.style.top = props.top.toString();
        selectionDiv.style.left = props.left.toString();
        if (props.right) {
            selectionDiv.style.right = props.right.toString();
        }
        if (props.width) {
            selectionDiv.style.width = props.width.toString();
        }
        selectionDiv.style.height = props.height.toString();
        this.selectionDisplay.appendChild(selectionDiv);
    }

    // Resolve methods

    private locate(x: number, y: number, el?: HTMLElement) {
        const listItems = this.contentDisplay.children;
        let listItem;
        let line;
        for (let i = 0; i < listItems.length; i += 1) {
            const item = listItems[i] as HTMLElement;
            if ( (el && item.isSameNode(el)) ||
            ( this.style.normalizeY(item.offsetTop + item.offsetHeight) > y ) ) {
                line = i;
                listItem = item;
                break;
            }
        }

        this.textRuler.adapt(listItem);
        // calculate average width height
        this.textRuler.text("etaoinshg");
        const avgW = this.textRuler.width / 8;
        const avgH = this.textRuler.height;
        const listTop = this.style.normalizeY(listItem.offsetTop);

        const cursorLine = Math.floor( (y - listTop) / avgH ); // line measurements should be 1 based
        const stats = this.getLineStat(line);
        const lineText = stats.lines[cursorLine];
        this.textRuler.text(lineText);

        let mLeft;
        let mCol;

        // Since the search is always before the test boundary, the boundary
        // is advanced by half an avgW so that it could snap forward to improve
        // targetting behavior
        const testBoundary = x + avgW / 2;

        if (this.textRuler.width < testBoundary) {
            mCol = lineText.length;
            mLeft = this.textRuler.width;
        } else {
            let testLen = Math.floor( x / avgW ) - 2; // 2 is the search region
            this.textRuler.text(lineText.substr(0, testLen));
            while (this.textRuler.width < testBoundary) {
                testLen += 1;
                this.textRuler.text(lineText.substr(0, testLen));
            }
            testLen -= 1;
            this.textRuler.text(lineText.substr(0, testLen));
            mCol = testLen;
            mLeft = this.textRuler.width;
        }

        let prevCols = 0;
        if (cursorLine > 0) {
            for (let i = 0; i < cursorLine; i++) {
                prevCols += stats.lines[i].length;
            }
        }

        return {
            line,
            col: prevCols + mCol,
            top: this.style.normalizeY(listItem.offsetTop) + (cursorLine) * avgH,
            left: mLeft,
        };
    }

    private measure(line: number, col: number) {
        const el = this.contentDisplay.children.item(line) as HTMLDivElement;
        const baseTop = this.style.normalizeY(el.offsetTop);
        this.textRuler.adapt(el);
        const stats = this.getLineStat(line);

        const lines = stats.lines;

        let counter = 0;
        let partialText;
        let lineNum;
        for (let i = 0; i < lines.length; i++) {
            const innerline = lines[i];
            if (counter + innerline.length === col && i < lines.length - 1) {
                // This is to make sure when we reach the end of a "line"
                // we move to the next line for line wraps
                lineNum = i + 1;
                partialText = "";
                break;
            } else if (counter + innerline.length >= col) {
                partialText = innerline.substr(0, col - counter);
                lineNum = i;
                break;
            } else {
                counter += innerline.length;
            }
        }

        this.textRuler.text(partialText);

        return {
            top: baseTop + lineNum * this.style.lineHeight,
            left: this.textRuler.width,
        };
    }

    private lineStatCache = new Map();

    private getLineStat(lineNum: number) {
        const childItem = this.contentDisplay.children.item(lineNum);
        const id = childItem.getAttribute("id");
        let stat = this.lineStatCache.get(id);
        if (!stat) {
            const lineData = this.docObj.lineAt(lineNum);
            const formattedLine = this.formatter.format(lineData);
            stat = this.renderer.build(formattedLine);
            this.lineStatCache.set("id", stat);
        }
        return stat;
    }

    private createLineItem(): HTMLElement {
        const lineItem = document.createElement("div")
        lineItem.classList.add("editor-list-item");
        lineItem.setAttribute("id", `list-item$${Utils.generateId()}`);
        lineItem.style.minHeight = `${this.style.lineHeight}px`;
        return lineItem;
    }

    private createRowItem(): HTMLElement {
        const lineItem = document.createElement("div")
        lineItem.classList.add("editor-row-item");
        lineItem.setAttribute("id", `row-item$${Utils.generateId()}`);
        lineItem.style.minHeight = `${this.style.lineHeight}px`;
        return lineItem;
    }

}
