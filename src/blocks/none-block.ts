import { Block, BlockType } from "./block";

export class NoneBlock implements Block {
  readonly type: BlockType = "none";
  private lines: string[] = [];

  constructor() {}

  appendLine(line: string): void {
    this.lines.push(line);
  }
  getLines(): string[] {
    return this.lines;
  }
}
