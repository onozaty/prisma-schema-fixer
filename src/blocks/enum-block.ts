import { Block } from "./block";

export class EnumBlock implements Block {
  private lines: Line[] = [];

  constructor(lines?: string[]) {
    if (lines !== undefined) {
      for (const line of lines) {
        this.appendLine(line);
      }
    }
  }

  appendLine(line: string): void {
    if (this.lines.length === 0) {
      this.lines.push(new StartLine(line));
    } else {
      this.lines.push(parseLine(line));
    }
  }
  getLines(): string[] {
    return this.lines.map((line) => line.toString());
  }

  getEnumName(): string {
    const startLine = this.lines[0] as StartLine;
    return startLine.enumName;
  }
  getMap(): string | undefined {
    const mapLine = this.lines.find(
      (line): line is MapLine => line instanceof MapLine,
    );
    return mapLine?.map;
  }

  static filter(blocks: Block[]): EnumBlock[] {
    return blocks.filter(
      (block): block is EnumBlock => block instanceof EnumBlock,
    );
  }
}

const parseLine = (line: string): Line => {
  let match: RegExpMatchArray | null;
  if ((match = line.match(MapLine.LINE_REGEX)) !== null) {
    return new MapLine(match);
  }
  return new OtherLine(line);
};

interface Line {
  toString(): string;
}

class StartLine implements Line {
  static readonly LINE_REGEX =
    /^(?<before>enum\s+)(?<name>[a-zA-Z]\w*)(?<after>\s*{.*)$/;

  private readonly before: string;
  enumName: string;
  private readonly after: string;

  constructor(line: string) {
    const matched = line.match(StartLine.LINE_REGEX);
    if (matched === null) {
      throw new Error("Invalid enum name line");
    }
    this.before = matched.groups!.before;
    this.enumName = matched.groups!.name;
    this.after = matched.groups!.after;
  }

  toString(): string {
    return `${this.before}${this.enumName}${this.after}`;
  }
}

class MapLine implements Line {
  static readonly LINE_REGEX =
    /^(?<before>\s+)(?<map>@@map\("\w+"\))(?<after>.*)$/;
  private static readonly MAP_PREFIX = '@@map("';
  private static readonly MAP_SUFFIX = '")';

  private readonly before: string;
  map: string | undefined;
  private readonly after: string;

  constructor(match: RegExpMatchArray) {
    this.before = match.groups!.before;
    this.map = match.groups!.map.substring(
      MapLine.MAP_PREFIX.length,
      match.groups!.map.length - MapLine.MAP_SUFFIX.length,
    );
    this.after = match.groups!.after;
  }
  toString(): string {
    return (
      this.before +
      (this.map !== undefined
        ? `${MapLine.MAP_PREFIX}${this.map}${MapLine.MAP_SUFFIX}`
        : "") +
      this.after
    );
  }
}

class OtherLine implements Line {
  constructor(private readonly line: string) {}
  toString(): string {
    return this.line;
  }
}
