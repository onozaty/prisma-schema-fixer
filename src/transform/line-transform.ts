export const changeBlockName = (
  line: string,
  modifier: (beforeName: string) => string,
): string => {
  const splitted = line.split(" ");
  if (splitted.length < 3) {
    return line;
  }
  splitted[1] = modifier(splitted[1]);
  return splitted.join(" ");
};
