import { Block } from "../block";

const BLOCK_NAME_LINE_REGEX =
  /^(?<before>\w+\s+)(?<name>[a-zA-Z]\w*)(?<after>\s*{.*)$/;
const BLOCK_MAP_LINE_REGEX =
  /^(?<before>\s+@@map\(")(?<map>\w+)(?<after>"\).*)$/;
const FIELD_NAME_LINE_REGEX =
  /^(?<before>\s+)(?<name>[a-zA-Z]\w*)(?<after>\s*.*)$/;

export const changeBlockName = (
  block: Block,
  modifier: (beforeName: string) => string | undefined,
): void => {
  const beforeName = getBlockName(block.lines[0]);
  if (beforeName === undefined) {
    return;
  }

  const afterName = modifier(beforeName);
  if (afterName === undefined) {
    return;
  }

  [block.lines[0]] = replaceBlockName(block.lines[0], afterName);
};

export const changeBlockMap = (
  block: Block,
  modifier: (blockName: string) => string | undefined,
): void => {
  const blockName = getBlockName(block.lines[0]);
  if (blockName === undefined) {
    return;
  }
  const map = modifier(blockName);
  if (map === undefined) {
    return;
  }

  for (let index = 0; index < block.lines.length; index++) {
    const [newLine, replaced] = replaceBlockMap(block.lines[index], map);
    if (replaced) {
      // existing map found, replace it
      block.lines[index] = newLine;
      return;
    }
  }

  // if not found, add new map
  block.lines.splice(block.lines.length - 1, 0, `  @@map("${map}")`);
};

export const changeFieldName = (
  block: Block,
  modifier: (model: string, filed: string) => string | undefined,
): void => {
  const model = getBlockName(block.lines[0]);
  if (model === undefined) {
    return;
  }

  for (let index = 1; index < block.lines.length - 1; index++) {
    // skip start and end line
    const beforeName = getFieldName(block.lines[index]);
    if (beforeName === undefined) {
      continue;
    }

    const afterName = modifier(model, beforeName);
    if (afterName === undefined) {
      return;
    }

    [block.lines[index]] = replaceFieldName(block.lines[index], afterName);
  }
};

const getBlockName = (line: string): string | undefined => {
  const matched = line.match(BLOCK_NAME_LINE_REGEX);
  if (matched === null) {
    return undefined;
  }
  return matched.groups!.name;
};

const replaceBlockName = (line: string, name: string): [string, boolean] => {
  const matched = line.match(BLOCK_NAME_LINE_REGEX);
  if (matched === null) {
    return [line, false];
  }
  return [`${matched.groups!.before}${name}${matched.groups!.after}`, true];
};

const replaceBlockMap = (line: string, map: string): [string, boolean] => {
  const matched = line.match(BLOCK_MAP_LINE_REGEX);
  if (matched === null) {
    return [line, false];
  }
  return [`${matched.groups!.before}${map}${matched.groups!.after}`, true];
};

const getFieldName = (line: string): string | undefined => {
  const matched = line.match(FIELD_NAME_LINE_REGEX);
  if (matched === null) {
    return undefined;
  }
  return matched.groups!.name;
};

const replaceFieldName = (line: string, name: string): [string, boolean] => {
  const matched = line.match(FIELD_NAME_LINE_REGEX);
  if (matched === null) {
    return [line, false];
  }
  return [`${matched.groups!.before}${name}${matched.groups!.after}`, true];
};
