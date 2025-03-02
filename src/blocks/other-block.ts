import { Block, BlockType } from "./block";

export class OtherBlock implements Block {
  readonly type: BlockType = "other";
  private lines: string[] = [];

  constructor() {}

  appendLine(line: string): void {
    this.lines.push(line);
  }
  getLines(): string[] {
    return this.lines;
  }
}
