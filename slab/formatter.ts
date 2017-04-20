export interface INode {
    literal: string;
}

export interface IFormatter {
    format(line: string): INode;
}

export class PlainTextFormatter implements IFormatter {
    format(line: string): INode {
        return {
            literal: line,
        }
    }
}
