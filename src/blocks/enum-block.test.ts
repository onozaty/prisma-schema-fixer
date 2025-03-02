import { EnumBlock } from "./enum-block";

describe("EnumBlock", () => {
  test("minimum", () => {
    // Arrange
    const lines = ["enum Role {", "  USER", "  ADMIN", "}"];

    // Act
    const enumBlock = new EnumBlock();
    lines.forEach((line) => enumBlock.appendLine(line));

    // Assert
    expect(enumBlock.getLines()).toEqual(lines);
    expect(enumBlock.getEnumName()).toEqual("Role");
    expect(enumBlock.getMap()).toEqual(undefined);
  });

  test("map", () => {
    // Arrange
    const lines = ["enum Role {", "  USER", "  ADMIN", '  @@map("roles")', "}"];

    // Act
    const enumBlock = new EnumBlock();
    lines.forEach((line) => enumBlock.appendLine(line));

    // Assert
    expect(enumBlock.getLines()).toEqual(lines);
    expect(enumBlock.getEnumName()).toEqual("Role");
    expect(enumBlock.getMap()).toEqual("roles");
  });
});
