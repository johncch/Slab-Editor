export class EventEmitter {
    /// <reference path="dts/typescript/lib.es6.d.ts" />
    private eventListeners: Map<string, Array<(...args) => void>>;

    constructor() {
        this.eventListeners = new Map();
    }

    on(event: string, listener: (...args) => void) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, [listener]);
        } else {
            this.eventListeners.get(event).push(listener);
        }

        return new Listener(this, event, listener);
    }

    addListener(event: string, listener: (...args) => void) {
        return this.on(event, listener);
    }

    removeListener();
    removeListener(id: Listener);
    removeListener(event: Function, listener?: Function);

    removeListener() {
        if (arguments.length === 0) {
            this.eventListeners.clear();
        } else if (arguments.length === 1 && typeof arguments[0] == 'object') {
            let id = arguments[0];
            this.removeListener(id.event, id.listener);
        } else if (arguments.length >= 1) {
            let event = <string>arguments[0];
            let listener = <(options) => void>arguments[1];

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
    protected emit(event: string, ...args) {
        if (this.eventListeners.has(event)) {
            for (let listener of this.eventListeners.get(event)) {
                listener(...args);
            }
        }
    }
}

export class Listener {
    constructor(public owner: EventEmitter,
        public event: string,
        public listener: (...args) => void) {

    }

    unbind() {
        this.owner.removeListener(this);
    }
}