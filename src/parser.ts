import { Block } from "./blocks/block";
import { EnumBlock } from "./blocks/enum-block";
import { ModelBlock } from "./blocks/model-block";
import { NoneBlock } from "./blocks/none-block";
import { OtherBlock } from "./blocks/other-block";

export const parseBlocks = (schemaContent: string): Block[] => {
  const blocks: Block[] = [];
  const lines = schemaContent.split("\n");
  let currentBlock: Block = new NoneBlock();
  for (const line of lines) {
    const judgeResult = judgeLine(line);
    if (judgeResult.result === "Start") {
      if (!currentBlock.isEmpty()) {
        blocks.push(currentBlock);
      }
      currentBlock = judgeResult.newBlock;
      currentBlock.appendLine(line);
    } else if (judgeResult.result === "End") {
      currentBlock.appendLine(line);
      blocks.push(currentBlock);
      currentBlock = new NoneBlock();
    } else {
      currentBlock.appendLine(line);
    }
  }
  if (!currentBlock.isEmpty()) {
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

    switch (type) {
      case "model":
        return { result: "Start", newBlock: new ModelBlock() };
      case "enum":
        return { result: "Start", newBlock: new EnumBlock() };
      default:
        return { result: "Start", newBlock: new OtherBlock() };
    }
  }

  return { result: "Continue" };
};

export const joinBlocks = (blocks: Block[]): string => {
  return blocks.map((block) => block.getLines().join("\n")).join("\n");
};
