/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = generateId;
/* harmony export (immutable) */ __webpack_exports__["b"] = log;
function generateId() {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
    const len = 8;
    const id = [];
    for (let i = 0; i < len; i += 1) {
        const rnum = Math.floor(Math.random() * chars.length);
        id.push(chars.charAt(rnum));
    }
    return id.join("");
}
const debug = true;
function log(...args) {
    if (debug) {
        console.log.apply(this, args);
    }
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cursor__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__document__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__keymap__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__selection__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__style__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__textruler__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__utils__ = __webpack_require__(0);







class SlabEditor {
    constructor(element, options) {
        this.id = __WEBPACK_IMPORTED_MODULE_6__utils__["a" /* generateId */]();
        // Mouse methods
        this.cursorTimeout = -1;
        // Keyboard shortcut methods
        this.commandTriggered = false;
        this.measuredLineCache = {};
        this.canvas = element;
        this.canvas.setAttribute("tabIndex", "0");
        this.canvas.style.position = "relative";
        this.canvas.style.userSelect = "none";
        this.canvas.innerHTML = "";
        this.style = new __WEBPACK_IMPORTED_MODULE_4__style__["a" /* Style */](element);
        this.setupElements();
        this.attachEventHandlers();
        options = options || {};
        this.keymap = options.keymap || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__keymap__["a" /* defaultKeyMap */])();
        const source = options.source || "";
        this.load(source);
    }
    // Loads a document
    load(text) {
        this.contentDisplay.innerHTML = "";
        text = text || "";
        this.docObj = new __WEBPACK_IMPORTED_MODULE_1__document__["a" /* Document */](text);
        for (let i = 0; i < this.docObj.numLines; i += 1) {
            const content = this.docObj.lineAt(i);
            const listItem = this.createLineItem();
            listItem.textContent = content;
            this.contentDisplay.appendChild(listItem);
        }
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
        this.textRuler = new __WEBPACK_IMPORTED_MODULE_5__textruler__["a" /* TextRuler */]();
        this.canvas.appendChild(this.textRuler.element);
        this.cursor = new __WEBPACK_IMPORTED_MODULE_0__cursor__["a" /* Cursor */](this.style);
        this.cursor.attachTo({ left: 0, top: 0 });
        this.canvas.appendChild(this.cursor.element);
        this.cursor.focus();
        this.selection = new __WEBPACK_IMPORTED_MODULE_3__selection__["a" /* Selection */]();
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
    handleCanvasClick(e) {
        __WEBPACK_IMPORTED_MODULE_6__utils__["b" /* log */]("[click]");
        __WEBPACK_IMPORTED_MODULE_6__utils__["b" /* log */](e.shiftKey);
    }
    handleCanvasDblClick(e) {
        __WEBPACK_IMPORTED_MODULE_6__utils__["b" /* log */]("[double click]");
        e.preventDefault();
        e.stopPropagation();
        if (this.cursorTimeout > -1) {
            clearTimeout(this.cursorTimeout);
        }
        this.canvas.focus();
    }
    handleCanvasMouseDown(e) {
        const coords = this.normalizeMouseCoordinates(e);
        const pos = this.locate(coords.x, coords.y);
        this.selection.anchor.set(pos.line, pos.col);
    }
    handleCanvasMouseUp(e) {
        const coords = this.normalizeMouseCoordinates(e);
        const pos = this.locate(coords.x, coords.y);
        this.selection.focus.set(pos.line, pos.col);
        this.render();
    }
    normalizeMouseCoordinates(e) {
        const boundingRect = this.contentDisplay.getBoundingClientRect();
        const body = document.body;
        const scrollTop = window.pageYOffset || this.contentDisplay.scrollTop || body.scrollTop;
        const scrollLeft = window.pageXOffset || this.contentDisplay.scrollLeft || body.scrollLeft;
        const clientTop = this.contentDisplay.clientTop || body.clientTop || 0;
        const clientLeft = this.contentDisplay.clientLeft || body.clientLeft || 0;
        const y = e.pageY - (boundingRect.top + scrollTop - clientTop);
        const x = e.pageX - (boundingRect.left + scrollLeft - clientLeft);
        return { x, y };
    }
    handleCommand(e) {
        const command = {
            keycode: e.keyCode,
            alt: e.altKey,
            ctrl: e.ctrlKey,
            cmd: e.metaKey,
            shift: e.shiftKey,
        };
        const executed = this.keymap.execCommand(this, command);
        if (executed) {
            e.preventDefault();
            e.stopPropagation();
            this.render();
        }
        this.commandTriggered = executed;
    }
    handleKeyPress(e) {
        if (this.commandTriggered) {
            this.commandTriggered = false;
            return;
        }
        const target = e.target;
        if (target instanceof HTMLTextAreaElement) {
            __WEBPACK_IMPORTED_MODULE_6__utils__["b" /* log */](`[keypress] ${this.cursor.textarea.value}`);
            const insChar = target.value;
            if (insChar.length > 0) {
                if (!this.selection.isCollapsed) {
                    this.removeAndCollapse();
                }
                target.value = "";
                this.docObj.insert(this.selection.anchor.line, this.selection.anchor.col, insChar, this.id);
            }
        }
    }
    focusInput() {
        this.cursorTimeout = -1;
        this.cursor.focus();
    }
    // Doc Obj handlers
    handleDocObjChange(e) {
        let changeMarker;
        switch (e.type) {
            case __WEBPACK_IMPORTED_MODULE_1__document__["b" /* ChangeType */].Insert:
                this.update(e.line);
                changeMarker = new __WEBPACK_IMPORTED_MODULE_3__selection__["b" /* Marker */](e.line, e.col);
                if (this.selection.anchor.greaterThanOrEqual(changeMarker)) {
                    this.moveMarker(this.selection.anchor, e.data.length);
                }
                if (this.selection.focus.greaterThanOrEqual(changeMarker)) {
                    this.moveMarker(this.selection.focus, e.data.length);
                }
                this.render();
                break;
            case __WEBPACK_IMPORTED_MODULE_1__document__["b" /* ChangeType */].Remove:
                this.update(e.line);
                changeMarker = new __WEBPACK_IMPORTED_MODULE_3__selection__["b" /* Marker */](e.line, e.col);
                if (this.selection.anchor.greaterThanOrEqual(changeMarker)) {
                    this.moveMarker(this.selection.anchor, -e.data.length);
                }
                if (this.selection.focus.greaterThanOrEqual(changeMarker)) {
                    this.moveMarker(this.selection.focus, -e.data.length);
                }
                this.render();
                break;
            case __WEBPACK_IMPORTED_MODULE_1__document__["b" /* ChangeType */].InsertLine:
                const newItem = this.createLineItem();
                const nextChild = this.contentDisplay.children[e.line];
                this.contentDisplay.insertBefore(newItem, nextChild);
                // TODO fix selection
                break;
            case __WEBPACK_IMPORTED_MODULE_1__document__["b" /* ChangeType */].RemoveLine:
                const lineItem = this.contentDisplay.children[e.line];
                lineItem.remove();
                // TODO fix selection
                break;
        }
    }
    // Selection methods - methods that affect selection or selection markers
    moveMarker(cursor, moveLen) {
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
                }
                else {
                    // else we move to the end
                    cursor.col = currentLine.length;
                    break;
                }
            }
            else if (newCol < 0) {
                // Else if we need to move back
                if (cursor.line > 0) {
                    // We go up a line
                    cursor.line -= 1;
                    currentLine = this.docObj.lineAt(cursor.line);
                    cursor.col = currentLine.length;
                    moveLen = newCol + 1;
                }
                else {
                    // else we move to the start
                    cursor.col = 0;
                    break;
                }
            }
            else {
                cursor.col = newCol;
                break;
            }
        }
    }
    moveMarkerLine(cursor, unit) {
        const curPos = this.measure(cursor.line, cursor.col);
        const curTop = curPos.top + unit * this.style.lineHeight;
        console.log(curTop);
        if (curTop >= 0) {
            const pos = this.locate(curPos.left, curTop);
            console.log(pos);
            __WEBPACK_IMPORTED_MODULE_6__utils__["b" /* log */](pos);
            cursor.line = pos.line;
            cursor.col = pos.col;
        }
    }
    moveMarkerToLineStart(cursor) {
        cursor.col = 0;
    }
    moveMarkerToLineEnd(cursor) {
        const lineItem = this.docObj.lineAt(cursor.line);
        cursor.col = lineItem.length + 1;
    }
    moveMarkerToRowStart(cursor) {
        const lineItem = this.contentDisplay.children[cursor.line];
        const stats = this.measureLines(lineItem);
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
    moveMarkerToRowEnd(cursor) {
        const lineItem = this.contentDisplay.children[cursor.line];
        const stats = this.measureLines(lineItem);
        const lines = stats.lines;
        let offset = 0;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (offset + line.length > cursor.col) {
                const tempLen = offset + line.length + (i < (lines.length - 1) ? -1 : 0);
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
    update(line, moveCursor = false) {
        const lineItem = this.contentDisplay.children[line];
        lineItem.textContent = this.docObj.lineAt(line);
        // invalidate cache
        const id = lineItem.getAttribute("id");
        delete this.measuredLineCache[id];
        // if (moveCursor) {
        //     this.selection.set(line, col + data.length);
        //     this.render();
        // }
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
    remove(forward) {
        forward = forward || false;
        if (!this.selection.isCollapsed) {
            this.removeAndCollapse();
        }
        else {
            const line = this.selection.anchor.line;
            const col = this.selection.anchor.col;
            const text = this.docObj.lineAt(line);
            if (col === 0 && !forward) {
                if (line === 0) {
                    return; // already at the begining, can't delete
                }
                this.docObj.removeLine(line, this.id);
                const prevLine = line - 1;
                const prevItem = this.docObj.lineAt(prevLine);
                const prevItemLen = prevItem.length;
                this.docObj.insert(prevLine, prevItemLen, text, this.id);
            }
            else if (col === text.length && forward) {
                if (line === this.docObj.numLines - 1) {
                    return; // already at the end, can't delete
                }
                const nextLine = line + 1;
                const nextItemText = this.docObj.lineAt(nextLine);
                this.docObj.removeLine(nextLine, this.id);
                this.docObj.insert(line, text.length, nextItemText, this.id);
            }
            else {
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
        const lineItem = this.contentDisplay.children[start.line];
        const text = lineItem.textContent;
        let data;
        if (start.line === end.line) {
            const len = end.col - start.col;
            data = text.substr(start.col, len);
            this.docObj.remove(start.line, start.col, data, this.id);
        }
        else {
            data = text.substr(start.col);
            this.docObj.remove(start.line, start.col, data, this.id);
            const endLineItem = this.contentDisplay.children[end.line];
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
    // Draw methods
    render(anchorX, anchorY) {
        this.selectionDisplay.innerHTML = "";
        if (this.selection.isCollapsed) {
            // The selection is single
            this.cursor.show();
            if (anchorX && anchorY) {
                this.cursor.attachTo({ top: anchorY, left: anchorX });
            }
            else {
                const pos = this.measure(this.selection.anchor.line, this.selection.anchor.col);
                this.cursor.attachTo(pos);
            }
            this.cursor.focus();
        }
        else {
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
                });
            }
            else {
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
                    });
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
    drawSelection(props) {
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
    locate(x, y, el) {
        const listItems = this.contentDisplay.children;
        let listItem;
        let line;
        for (let i = 0; i < listItems.length; i += 1) {
            const _item = listItems[i];
            if ((el && _item.isSameNode(el)) ||
                (this.style.normalizeY(_item.offsetTop + _item.offsetHeight) > y)) {
                line = i;
                listItem = _item;
                break;
            }
        }
        this.textRuler.adapt(listItem);
        // calculate average width height
        this.textRuler.text("etaoinsh");
        const avgW = this.textRuler.width / 8;
        const avgH = this.textRuler.height;
        const listTop = this.style.normalizeY(listItem.offsetTop);
        const cursorLine = Math.floor((y - listTop) / avgH); // line measurements should be 1 based
        const stats = this.measureLines(listItem);
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
        }
        else {
            let testLen = Math.floor(x / avgW) - 2; // 2 is the search region
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
    measure(line, col) {
        const el = this.contentDisplay.children.item(line);
        const baseTop = this.style.normalizeY(el.offsetTop);
        this.textRuler.adapt(el);
        const stats = this.measureLines(el);
        const _lines = stats.lines;
        let counter = 0;
        let partialText, lineNum;
        for (let i = 0; i < _lines.length; i++) {
            const innerline = _lines[i];
            if (counter + innerline.length === col && i < _lines.length - 1) {
                // This is to make sure when we reach the end of a "line"
                // we move to the next line for line wraps
                lineNum = i + 1;
                partialText = "";
                break;
            }
            else if (counter + innerline.length >= col) {
                partialText = innerline.substr(0, col - counter);
                lineNum = i;
                break;
            }
            else {
                counter += innerline.length;
            }
        }
        this.textRuler.text(partialText);
        return {
            top: baseTop + lineNum * stats.avgH,
            left: this.textRuler.width,
        };
    }
    measureLines(el, numRows, strategy) {
        // Cache
        const elId = el.getAttribute("id");
        if (this.measuredLineCache[elId]) {
            return this.measuredLineCache[elId];
        }
        this.textRuler.text("etaoinsh");
        const elH = el.offsetHeight;
        const elW = el.offsetWidth;
        const avgW = this.textRuler.width / 8;
        const avgH = this.textRuler.height;
        const text = el.textContent;
        strategy = strategy || (text.split(/\s/).length > 1 ? "word" : "character");
        this.textRuler.text(text);
        if (this.textRuler.height === avgH) {
            return {
                lines: [text],
                avgW,
                avgH,
            };
        }
        const listRows = Math.floor(elH / avgH);
        const upperLimit = listRows - 1;
        let lineText;
        let lineStart;
        let j;
        const lines = [];
        if (strategy === "character") {
            const avgLine = Math.floor(elW / avgW * 0.7);
            // Easy workaround for script characters
            lineStart = 0;
            let lineEnd = lineStart + avgLine;
            for (j = 0; j < upperLimit; j++) {
                this.textRuler.text(text.substring(lineStart, lineEnd));
                while (this.textRuler.height === avgH) {
                    lineEnd += 1;
                    this.textRuler.text(text.substring(lineStart, lineEnd));
                }
                while (this.textRuler.height > avgH) {
                    lineEnd -= 1;
                    this.textRuler.text(text.substring(lineStart, lineEnd));
                }
                // found!
                lineText = text.substring(lineStart, lineEnd);
                lines.push(lineText);
                if (numRows && numRows === j) {
                    return {
                        lines,
                        avgW,
                        avgH,
                    };
                }
                lineStart = lineEnd;
                lineEnd = lineStart + avgLine;
            }
        }
        else if (strategy === "word") {
            // English and latin languages with words
            const words = text.split(" ");
            // This is to lump all the whitespace together with the previous word
            // Workaround for how Firefox's word display behavior using css
            // property white-space: pre-wrap
            let spaceCount = [];
            for (let i = words.length - 1; i >= 0; i -= 1) {
                const word = words[i];
                if (word === "") {
                    words.splice(i, 1);
                    spaceCount.push(" ");
                }
                else if (spaceCount.length > 0) {
                    words[i] = words[i] + spaceCount.join("");
                    spaceCount = [];
                }
            }
            lineStart = 0;
            let wordStart = 0;
            let wordEnd = 3;
            let tempStr = words[wordStart];
            for (j = 0; j < upperLimit; j++) {
                this.textRuler.text(tempStr);
                while (this.textRuler.height === avgH) {
                    wordEnd += 1;
                    tempStr = words.slice(wordStart, wordEnd).join(" ");
                    this.textRuler.text(tempStr);
                }
                while (this.textRuler.height > avgH) {
                    wordEnd -= 1;
                    tempStr = words.slice(wordStart, wordEnd).join(" ");
                    this.textRuler.text(tempStr);
                }
                lineText = words.slice(wordStart, wordEnd).join(" ");
                while (text.charAt(lineStart + lineText.length) === " ") {
                    lineText += " ";
                }
                lines.push(lineText);
                if (numRows && numRows === j) {
                    return {
                        lines,
                        avgW,
                        avgH,
                    };
                }
                wordStart = wordEnd;
                wordEnd = wordStart + 3;
                tempStr = words[wordEnd];
                lineStart = lineStart + lineText.length;
            }
        }
        lineText = text.substr(lineStart);
        lines.push(lineText);
        const result = {
            lines,
            avgW,
            avgH,
        };
        this.measuredLineCache[elId] = result;
        return result;
    }
    createLineItem() {
        const lineItem = document.createElement("div");
        lineItem.classList.add("editor-list-item");
        lineItem.setAttribute("id", `list-item$${__WEBPACK_IMPORTED_MODULE_6__utils__["a" /* generateId */]()}`);
        lineItem.style.minHeight = `${this.style.lineHeight}px`;
        return lineItem;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SlabEditor;



/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(17)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./editor.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./editor.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Cursor {
    constructor(style) {
        this.style = style;
        this.element = document.createElement("div");
        this.element.classList.add("editor-cursor");
        this.textarea = document.createElement("textarea");
        this.element.appendChild(this.textarea);
    }
    focus() {
        this.textarea.focus();
    }
    attachTo(pos) {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Cursor;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__events__ = __webpack_require__(5);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ChangeType; });

var ChangeType;
(function (ChangeType) {
    ChangeType[ChangeType["Insert"] = 0] = "Insert";
    ChangeType[ChangeType["InsertLine"] = 1] = "InsertLine";
    ChangeType[ChangeType["Remove"] = 2] = "Remove";
    ChangeType[ChangeType["RemoveLine"] = 3] = "RemoveLine";
})(ChangeType || (ChangeType = {}));
class Document extends __WEBPACK_IMPORTED_MODULE_0__events__["a" /* EventEmitter */] {
    constructor(text = "") {
        super();
        // id: string;
        // title: string;
        this.contents = [];
        this.contents = text.split(/\n/);
    }
    get numLines() {
        return this.contents.length;
    }
    lineAt(index) {
        if (index < this.contents.length && index >= 0) {
            return this.contents[index];
        }
        return null;
    }
    addLine(line, origin) {
        this.contents.splice(line, 0, "");
        this.emit("change", {
            type: ChangeType.InsertLine,
            line: line,
            origin: origin
        });
    }
    removeLine(line, origin) {
        this.contents.splice(line, 1);
        this.emit("change", {
            type: ChangeType.RemoveLine,
            line: line,
            origin: origin
        });
    }
    insert(line, col, data, origin) {
        if (data === "") {
            return;
        }
        const lineContent = this.contents[line] || "";
        this.contents[line] = lineContent.substr(0, col) + data +
            lineContent.substr(col);
        this.emit("change", {
            type: ChangeType.Insert,
            line: line,
            col: col,
            data: data,
            newContent: this.contents[line],
            oldContent: lineContent,
            origin: origin
        });
    }
    remove(line, col, data, origin) {
        if (data.length === 0) {
            return;
        }
        const lineContent = this.contents[line];
        const length = data.length;
        this.contents[line] = lineContent.substr(0, col) +
            lineContent.substr(col + length);
        this.emit("change", {
            type: ChangeType.Remove,
            line: line,
            col: col,
            data: data,
            newContent: this.contents[line],
            oldContent: lineContent,
            origin: origin
        });
    }
    toString() {
        return this.contents.join("\n");
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Document;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class EventEmitter {
    constructor() {
        this.eventListeners = new Map();
    }
    on(event, listener) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, [listener]);
        }
        else {
            this.eventListeners.get(event).push(listener);
        }
        return new Listener(this, event, listener);
    }
    addListener(event, listener) {
        return this.on(event, listener);
    }
    removeListener() {
        if (arguments.length === 0) {
            this.eventListeners.clear();
        }
        else if (arguments.length === 1 && typeof arguments[0] == 'object') {
            let id = arguments[0];
            this.removeListener(id.event, id.listener);
        }
        else if (arguments.length >= 1) {
            let event = arguments[0];
            let listener = arguments[1];
            if (this.eventListeners.has(event)) {
                var listeners = this.eventListeners.get(event);
                var idx;
                while (!listener || (idx = listeners.indexOf(listener)) != -1) {
                    listeners.splice(idx, 1);
                }
            }
        }
    }
    /**
     * Emit event. Calls all bound listeners with args.
     */
    emit(event, ...args) {
        if (this.eventListeners.has(event)) {
            for (let listener of this.eventListeners.get(event)) {
                listener(...args);
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EventEmitter;

class Listener {
    constructor(owner, event, listener) {
        this.owner = owner;
        this.event = event;
        this.listener = listener;
    }
    unbind() {
        this.owner.removeListener(this);
    }
}
/* unused harmony export Listener */



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = defaultKeyMap;

const KEYCODEMAP = {
    8: "Backspace",
    9: "Tab",
    13: "Enter",
    // 16: "Shift",
    17: "Ctrl",
    18: "Alt",
    19: "Pause",
    20: "Capslock",
    27: "Escape",
    33: "Pageup",
    34: "Pagedown",
    35: "End",
    36: "Home",
    37: "Left",
    38: "Up",
    39: "Right",
    40: "Down",
    45: "Insert",
    46: "Delete",
    65: "A",
};
class DefaultKeyMap {
    constructor() {
        this.keymap = new Map();
        this.keymap.set("Right", this.moveRight);
        this.keymap.set("Shift-Right", this.selectRight);
        this.keymap.set("Left", this.moveLeft);
        this.keymap.set("Shift-Left", this.selectLeft);
        this.keymap.set("Up", this.moveUp);
        this.keymap.set("Shift-Up", this.selectUp);
        this.keymap.set("Down", this.moveDown);
        this.keymap.set("Shift-Down", this.selectDown);
        this.keymap.set("Home", this.moveLineStart);
        this.keymap.set("End", this.moveLineEnd);
        this.keymap.set("Backspace", this.backspace);
        this.keymap.set("Delete", this.delete);
        this.keymap.set("Enter", this.addLine);
        // TODO pageUp, pageDown
    }
    moveRight(editor) {
        if (!editor.selection.isCollapsed) {
            editor.selection.collapse(false, true);
        }
        else {
            editor.moveMarker(editor.selection.anchor, 1);
            editor.moveMarker(editor.selection.focus, 1);
        }
    }
    selectRight(editor) {
        editor.moveMarker(editor.selection.focus, 1);
    }
    moveLeft(editor) {
        if (!editor.selection.isCollapsed) {
            editor.selection.collapse(true, true);
        }
        else {
            editor.moveMarker(editor.selection.anchor, -1);
            editor.moveMarker(editor.selection.focus, -1);
        }
    }
    selectLeft(editor) {
        editor.moveMarker(editor.selection.focus, -1);
    }
    moveUp(editor) {
        if (!editor.selection.isCollapsed) {
            editor.selection.collapse(true, true);
        }
        else {
            editor.moveMarkerLine(editor.selection.anchor, -1);
            editor.moveMarkerLine(editor.selection.focus, -1);
        }
    }
    selectUp(editor) {
        editor.moveMarkerLine(editor.selection.focus, -1);
    }
    moveDown(editor) {
        if (!editor.selection.isCollapsed) {
            editor.selection.collapse(false, true);
        }
        else {
            editor.moveMarkerLine(editor.selection.anchor, 1);
            editor.moveMarkerLine(editor.selection.focus, 1);
        }
    }
    moveLineStart(editor) {
        editor.moveMarkerToLineStart(editor.selection.anchor);
        editor.moveMarkerToLineStart(editor.selection.focus);
    }
    selectLineStart(editor) {
        editor.moveMarkerToLineStart(editor.selection.focus);
    }
    moveLineEnd(editor) {
        editor.moveMarkerToLineEnd(editor.selection.anchor);
        editor.moveMarkerToLineEnd(editor.selection.focus);
    }
    selectLineEnd(editor) {
        editor.moveMarkerToLineEnd(editor.selection.focus);
    }
    moveRowStart(editor) {
        editor.moveMarkerToRowStart(editor.selection.anchor);
        editor.moveMarkerToRowStart(editor.selection.focus);
    }
    selectRowStart(editor) {
        editor.moveMarkerToRowStart(editor.selection.focus);
    }
    moveRowEnd(editor) {
        editor.moveMarkerToRowEnd(editor.selection.anchor);
        editor.moveMarkerToRowEnd(editor.selection.focus);
    }
    selectRowEnd(editor) {
        editor.moveMarkerToRowEnd(editor.selection.focus);
    }
    selectAll(editor) {
        editor.selectAll();
    }
    selectDown(editor) {
        editor.moveMarkerLine(editor.selection.focus, 1);
    }
    addLine(editor) {
        editor.addLine();
    }
    backspace(editor) {
        editor.remove(false);
    }
    delete(editor) {
        editor.remove(true);
    }
    execCommand(editor, command) {
        const key = this.serialize(command);
        __WEBPACK_IMPORTED_MODULE_0__utils__["b" /* log */](`[keymap] ${key}`);
        const func = this.keymap.get(key);
        if (func) {
            func(editor);
        }
        return !!func;
    }
    serialize(command) {
        let cmd = KEYCODEMAP[command.keycode];
        if (command.alt) {
            cmd = "Alt-" + cmd;
        }
        if (command.cmd) {
            cmd = "Cmd-" + cmd;
        }
        if (command.ctrl) {
            cmd = "Ctrl-" + cmd;
        }
        if (command.shift) {
            cmd = "Shift-" + cmd;
        }
        return cmd;
    }
}
/* unused harmony export DefaultKeyMap */

class PCKeyMap extends DefaultKeyMap {
    constructor() {
        super();
        this.keymap.set("Ctrl-A", this.selectAll);
        // TODO: cut, copy, paste
    }
}
/* unused harmony export PCKeyMap */

class MacKeyMap extends DefaultKeyMap {
    constructor() {
        super();
        this.keymap.set("Cmd-Left", this.moveRowStart);
        this.keymap.set("Shift-Cmd-Left", this.selectRowStart);
        this.keymap.set("Cmd-Right", this.moveRowEnd);
        this.keymap.set("Shift-Cmd-Right", this.selectRowEnd);
        this.keymap.set("Cmd-A", this.selectAll);
        // TODO: cut, copy, paste
    }
}
/* unused harmony export MacKeyMap */

function defaultKeyMap() {
    if (/Mac/.test(navigator.platform)) {
        return new MacKeyMap();
    }
    return new PCKeyMap();
}


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Marker {
    constructor(line = 0, col = 0) {
        this.line = 0;
        this.col = 0;
        this.line = line;
        this.col = col;
    }
    set(line, col) {
        this.line = line;
        this.col = col;
    }
    greaterThanOrEqual(marker) {
        return this.line >= marker.line && this.col >= marker.col;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Marker;

class Selection {
    constructor() {
        this.anchor = new Marker();
        this.focus = new Marker();
    }
    set(line, col) {
        this.anchor.set(line, col);
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
    collapse(start = false, noDir = false) {
        const inverted = this.isInverted;
        if (!noDir || !inverted) {
            if (start) {
                // move focus to anchor
                this.focus.line = this.anchor.line;
                this.focus.col = this.anchor.col;
            }
            else {
                // move anchor to focus
                this.anchor.line = this.focus.line;
                this.anchor.col = this.focus.col;
            }
        }
        else {
            if (start) {
                // move anchor to focus
                this.anchor.line = this.focus.line;
                this.anchor.col = this.focus.col;
            }
            else {
                // move focus to anchor
                this.focus.line = this.anchor.line;
                this.focus.col = this.anchor.col;
            }
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Selection;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Style {
    constructor(el) {
        this.config = {
            lineHeightMultiplier: 1.5,
        };
        // Values
        this.padding = { top: 0, right: 0, bottom: 0, left: 0 };
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
    normalizeX(x) {
        return x - this.padding.left;
    }
    normalizeY(y) {
        return y - this.padding.top;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Style;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class TextRuler {
    constructor() {
        this.element = document.createElement("span");
        this.element.classList.add("editor-text-ruler");
        // this.element.style.display = "none";
        //this.element.style.left = "-5000px";
        this.element.style["white-space"] = "pre-wrap";
    }
    adapt(el) {
        const style = getComputedStyle(el);
        this.element.style["font-family"] = style.getPropertyValue("font-family");
        this.element.style["font-size"] = style.getPropertyValue("font-size");
        this.element.style["font-weight"] = style.getPropertyValue("font-weight");
        this.element.style["line-height"] = style.getPropertyValue("line-height");
        this.element.style.padding = style.getPropertyValue("padding");
        this.element.style.margin = style.getPropertyValue("margin");
        this.element.style["max-width"] = el.offsetWidth;
    }
    text(text) {
        this.element.textContent = text;
    }
    get width() {
        return this.element.offsetWidth;
    }
    get height() {
        return this.element.offsetHeight;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TextRuler;



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sass_editor_scss__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sass_editor_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__sass_editor_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__slab_editor__ = __webpack_require__(1);


let testText = `When Mr. Bilbo Baggins of Bag End announced that he would shortly be celebrating his eleventy-first birthday with a party of special magnificence, there was much talk and excitement in Hobbiton. 

Bilbo was very rich and very peculiar, and had been the wonder of the Shire for sixty years, ever since his remarkable disappearance and unexpected return. The riches he had brought back from his travels had now become a local legend, and it was popularly believed, whatever the old folk might say, that the Hill at Bag End was full of tunnels stuffed with treasure. And if that was not enough for fame, there was also his prolonged vigour to marvel at. Time wore on, but it seemed to have little effect on Mr. Baggins. At ninety he was much the same as at fifty. At ninety-nine they began to call him well-preserved; but unchanged would have been nearer the mark. There were some that shook their heads and thought this was too much of a good thing; it seemed unfair that anyone should possess (apparently) perpetual youth as well as (reputedly) inexhaustible wealth. 

"It will have to be paid for," they said. "It isn't natural, and trouble will come of it!" 

But so far trouble had not come; and as Mr. Baggins was generous with his money, most people were willing to forgive him his oddities and his good fortune. He remained on visiting terms with his relatives (except, of course, the Sackville-Bagginses), and he had many devoted admirers among the hobbits of poor and unimportant families. But he had no close friends, until some of his younger cousins began to grow up.`;
const canvas = document.getElementById("canvas");
const editor = new __WEBPACK_IMPORTED_MODULE_1__slab_editor__["a" /* SlabEditor */](canvas, { source: testText });


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(11)
var ieee754 = __webpack_require__(15)
var isArray = __webpack_require__(16)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(19)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(14)(undefined);
// imports


// module
exports.push([module.i, ".editor-list-item {\n  white-space: pre-wrap;\n  word-wrap: break-word; }\n\n.editor-cursor {\n  position: absolute;\n  top: 0;\n  left: 0px;\n  width: 1px;\n  height: 25px;\n  margin: 0;\n  padding: 0;\n  vertical-align: top;\n  overflow: hidden; }\n  .editor-cursor.not-visible {\n    opacity: 0; }\n  .editor-cursor textarea {\n    border: none;\n    background: none;\n    margin: 0;\n    padding: 0;\n    font-size: 16pt;\n    width: 100%;\n    resize: none;\n    overflow: hidden; }\n    .editor-cursor textarea:focus {\n      outline: none; }\n\n.editor-text-ruler {\n  white-space: pre-wrap;\n  position: absolute;\n  top: 800px;\n  background: yellow; }\n\n.editor-selection {\n  position: absolute;\n  background: rgba(255, 98, 63, 0.2);\n  border-radius: 2px; }\n", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap) {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
  var base64 = new Buffer(JSON.stringify(sourceMap)).toString('base64');
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

  return '/*# ' + data + ' */';
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12).Buffer))

/***/ }),
/* 15 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 16 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(18);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 18 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);