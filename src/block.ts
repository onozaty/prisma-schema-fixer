// https://www.prisma.io/docs/orm/reference/prisma-schema-reference
export const BlockType = [
  "datasource",
  "generator",
  "model",
  "enum",
  "type",
  "none",
] as const;

export type BlockType = (typeof BlockType)[number];

export class Block {
  readonly type: BlockType;
  contents: string[];
  constructor(type: BlockType, contents: string[] = []) {
    this.type = type;
    this.contents = contents;
  }
}
