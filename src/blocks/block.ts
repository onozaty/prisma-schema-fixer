// https://www.prisma.io/docs/orm/reference/prisma-schema-reference

export interface Block {
  appendLine(line: string): void;
  getLines(): string[];
  isEmpty(): boolean;
}
