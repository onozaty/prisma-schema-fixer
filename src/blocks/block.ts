// https://www.prisma.io/docs/orm/reference/prisma-schema-reference
export const BlockType = [
  "datasource",
  "generator",
  "model",
  "enum",
  "type",
  "other",
  "none",
] as const;

export type BlockType = (typeof BlockType)[number];

export interface Block {
  readonly type: BlockType;
  appendLine(line: string): void;
  getLines(): string[];
}
