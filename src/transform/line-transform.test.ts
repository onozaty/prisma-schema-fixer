import { changeBlockName } from "./line-transform";

describe("changeBlockName", () => {
  test("normal", () => {
    // Arrange
    const line = "model Abc {";
    const modifier = (beforeName: string) => beforeName.toUpperCase();

    // Act/Assert
    expect(changeBlockName(line, modifier)).toBe("model ABC {");
  });
  test("splitted.length < 3", () => {
    // Arrange
    const line = "model Abc";
    const modifier = (beforeName: string) => beforeName.toUpperCase();

    // Act/Assert
    expect(changeBlockName(line, modifier)).toBe("model Abc");
  });
});
