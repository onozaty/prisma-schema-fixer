import { Block, BlockType } from "./block";

export const parseBlocks = (schemaContent: string): Block[] => {
  const blocks: Block[] = [];
  const lines = schemaContent.split("\n");
  let currentBlock: Block = new Block("none");
  for (const line of lines) {
    const judgeResult = judgeLine(line);
    if (judgeResult.result === "Start") {
      if (currentBlock.lines.length > 0) {
        blocks.push(currentBlock);
      }
      currentBlock = judgeResult.newBlock;
      currentBlock.lines.push(line);
    } else if (judgeResult.result === "End") {
      currentBlock.lines.push(line);
      blocks.push(currentBlock);
      currentBlock = new Block("none");
    } else {
      currentBlock.lines.push(line);
    }
  }
  if (currentBlock.lines.length > 0) {
    blocks.push(currentBlock);
  }
  return blocks;
};

type JudegeLineResult =
  | {
      result: "Start";
      newBlock: Block;
    }
  | {
      result: "End" | "Continue";
    };

const judgeLine = (line: string): JudegeLineResult => {
  if (line.startsWith("}")) {
    return { result: "End" };
  }

  const splited = line.split(" ");
  if (splited.length >= 3 && splited[2] === "{") {
    const type = splited[0];

    const blockType = BlockType.includes(type as BlockType)
      ? (type as BlockType)
      : "other";
    return { result: "Start", newBlock: new Block(blockType) };
  }

  return { result: "Continue" };
};
