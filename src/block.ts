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

export class Block {
  readonly type: BlockType;
  lines: string[];
  constructor(type: BlockType, lines: string[] = []) {
    this.type = type;
    this.lines = lines;
  }
}
