import { Block } from "../block";

export const changeBlockName = (
  block: Block,
  modifier: (beforeName: string) => string,
): void => {
  const splitted = block.lines[0].split(" ");
  if (splitted.length < 3) {
    return;
  }
  splitted[1] = modifier(splitted[1]);
  block.lines[0] = splitted.join(" ");
};
