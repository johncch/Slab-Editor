export function generateId(): string {
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

export function log(...args: any[]) {
    if (debug) {
        console.log.apply(this, args);
    }
}