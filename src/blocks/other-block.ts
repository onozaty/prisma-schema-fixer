import { Block } from "./block";

export class OtherBlock implements Block {
  private lines: string[] = [];

  constructor(lines?: string[]) {
    if (lines !== undefined) {
      for (const line of lines) {
        this.appendLine(line);
      }
    }
  }

  appendLine(line: string): void {
    this.lines.push(line);
  }
  getLines(): string[] {
    return this.lines;
  }
}
