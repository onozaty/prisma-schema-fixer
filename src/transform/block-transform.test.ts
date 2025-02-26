import { Block } from "../block";
import { changeBlockName } from "./block-transform";

describe("changeBlockName", () => {
  test("normal", () => {
    // Arrange
    const block = new Block("model", [
      "model abc {",
      "  field1: string",
      "  field2: number",
      "}",
    ]);
    const modifier = (beforeName: string) => beforeName.toUpperCase();

    // Act
    changeBlockName(block, modifier);

    // Assert
    expect(block.lines).toEqual([
      "model ABC {",
      "  field1: string",
      "  field2: number",
      "}",
    ]);
  });
  test("splitted.length < 3", () => {
    // Arrange
    const block = new Block("model", [
      "model abc",
      "  field1: string",
      "  field2: number",
      "}",
    ]);
    const modifier = (beforeName: string) => beforeName.toUpperCase();

    // Act
    changeBlockName(block, modifier);

    // Assert
    expect(block.lines).toEqual([
      "model abc",
      "  field1: string",
      "  field2: number",
      "}",
    ]);
  });
});
