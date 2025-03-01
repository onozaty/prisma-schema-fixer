import { Block } from "../block";

export const changeBlockName = (
  block: Block,
  modifier: (beforeName: string) => string | undefined,
): void => {
  const splitted = block.lines[0].split(" ");
  if (splitted.length < 3) {
    return;
  }
  const changed = modifier(splitted[1]);
  if (changed === undefined) {
    return;
  }

  splitted[1] = changed;
  block.lines[0] = splitted.join(" ");
};

export const changeBlockMap = (
  block: Block,
  modifier: (blockName: string) => string | undefined,
): void => {
  const blockName = getBlockName(block);
  if (blockName === undefined) {
    return;
  }
  const map = modifier(blockName);
  if (map === undefined) {
    return;
  }

  for (let index = 0; index < block.lines.length; index++) {
    const line = block.lines[index];
    if (line.trim().startsWith("@@map")) {
      // replace existing map
      block.lines[index] = line.replace(/@@map\(.*\)/, `@@map("${map}")`);
      return;
    }
  }

  // if not found, add new map
  block.lines.splice(block.lines.length - 1, 0, `  @@map("${map}")`);
};

const getBlockName = (block: Block): string | undefined => {
  const splitted = block.lines[0].split(" ");
  if (splitted.length < 3) {
    return undefined;
  }
  return splitted[1];
};
