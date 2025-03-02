import { NoneBlock } from "./none-block";

describe("NoneBlock", () => {
  test("none", () => {
    // Arrange
    const lines = [
      "",
      "//--------------------------",
      "// this is comment line",
      "//--------------------------",
      "                     /// this is comment line 2",
      "",
    ];

    // Act
    const noneBlock = new NoneBlock();
    lines.forEach((line) => noneBlock.appendLine(line));

    // Assert
    expect(noneBlock.getLines()).toEqual(lines);
  });
});
