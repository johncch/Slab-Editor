import { SlabEditor } from "./editor";
import * as Utils from "./utils";

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

export interface IKeyMap {
    execCommand(editor: SlabEditor, command: IKeyMapCommand): boolean;
}

interface IKeyMapCommand {
    keycode: number,
    ctrl: boolean,
    cmd: boolean,
    shift: boolean,
    alt: boolean,
}

export class DefaultKeyMap implements IKeyMap {
    keymap = new Map<string, (editor: SlabEditor) => void>();

    constructor() {
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

    moveRight(editor: SlabEditor) {
        if (!editor.selection.isCollapsed) {
            editor.selection.collapse(false, true);
        } else {
            editor.moveMarker(editor.selection.anchor, 1);
            editor.moveMarker(editor.selection.focus, 1);
        }
    }

    selectRight(editor: SlabEditor) {
        editor.moveMarker(editor.selection.focus, 1);
    }

    moveLeft(editor: SlabEditor) {
        if (!editor.selection.isCollapsed) {
            editor.selection.collapse(true, true);
        } else {
            editor.moveMarker(editor.selection.anchor, -1);
            editor.moveMarker(editor.selection.focus, -1);
        }
    }

    selectLeft(editor: SlabEditor) {
        editor.moveMarker(editor.selection.focus, -1);
    }

    moveUp(editor: SlabEditor) {
        if (!editor.selection.isCollapsed) {
            editor.selection.collapse(true, true);
        } else {
            editor.moveMarkerLine(editor.selection.anchor, -1);
            editor.moveMarkerLine(editor.selection.focus, -1);
        }
    }

    selectUp(editor: SlabEditor) {
        editor.moveMarkerLine(editor.selection.focus, -1);
    }

    moveDown(editor: SlabEditor) {
        if (!editor.selection.isCollapsed) {
            editor.selection.collapse(false, true);
        } else {
            editor.moveMarkerLine(editor.selection.anchor, 1);
            editor.moveMarkerLine(editor.selection.focus, 1);
        }
    }

    moveLineStart(editor: SlabEditor) {
        editor.moveMarkerToLineStart(editor.selection.anchor);
        editor.moveMarkerToLineStart(editor.selection.focus);
    }

    selectLineStart(editor: SlabEditor) {
        editor.moveMarkerToLineStart(editor.selection.focus);
    }

    moveLineEnd(editor: SlabEditor) {
        editor.moveMarkerToLineEnd(editor.selection.anchor);
        editor.moveMarkerToLineEnd(editor.selection.focus);
    }

    selectLineEnd(editor: SlabEditor) {
        editor.moveMarkerToLineEnd(editor.selection.focus);
    }

    moveRowStart(editor: SlabEditor) {
        editor.moveMarkerToRowStart(editor.selection.anchor);
        editor.moveMarkerToRowStart(editor.selection.focus);
    }

    selectRowStart(editor: SlabEditor) {
        editor.moveMarkerToRowStart(editor.selection.focus);
    }

    moveRowEnd(editor: SlabEditor) {
        editor.moveMarkerToRowEnd(editor.selection.anchor);
        editor.moveMarkerToRowEnd(editor.selection.focus);
    }

    selectRowEnd(editor: SlabEditor) {
        editor.moveMarkerToRowEnd(editor.selection.focus);
    }

    selectAll(editor: SlabEditor) {
        editor.selectAll();
    }

    selectDown(editor: SlabEditor) {
        editor.moveMarkerLine(editor.selection.focus, 1);
    }

    addLine(editor: SlabEditor) {
        editor.addLine();
    }

    backspace(editor: SlabEditor) {
        editor.delete(false);
    }

    delete(editor: SlabEditor) {
        editor.delete(true);
    }

    execCommand(editor: SlabEditor, command: IKeyMapCommand): boolean {
        const key = this.serialize(command);
        Utils.log(`[keymap] ${key}`);
        const func = this.keymap.get(key);
        if (func) {
            func(editor);
        }
        return !!func;
    }

    serialize(command: IKeyMapCommand): string {
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

export class PCKeyMap extends DefaultKeyMap {
    constructor() {
        super();
        this.keymap.set("Ctrl-A", this.selectAll);
        // TODO: cut, copy, paste
    }
}

export class MacKeyMap extends DefaultKeyMap {
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

export function defaultKeyMap(): IKeyMap {
    if (/Mac/.test(navigator.platform)) {
        return new MacKeyMap();
    }
    return new PCKeyMap();
}
