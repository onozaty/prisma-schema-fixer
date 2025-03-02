import { OtherBlock } from "./other-block";

describe("OtherBlock", () => {
  test("datasource", () => {
    // Arrange
    const lines = [
      "datasource db {",
      '  provider = "postgresql"',
      '  url      = env("DATABASE_URL")',
      "}",
    ];

    // Act
    const otherBlock = new OtherBlock();
    lines.forEach((line) => otherBlock.appendLine(line));

    // Assert
    expect(otherBlock.getLines()).toEqual(lines);
  });
});
