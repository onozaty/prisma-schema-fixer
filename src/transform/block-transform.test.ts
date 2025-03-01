import { Block } from "../block";
import { changeBlockMap, changeBlockName } from "./block-transform";

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

describe("changeBlockMap", () => {
  test("add", () => {
    // Arrange
    const block = new Block("model", [
      "model Abc {",
      "  field1: string",
      "  field2: number",
      "}",
    ]);
    const modifier = (blockName: string) => blockName.toLowerCase();

    // Act
    changeBlockMap(block, modifier);

    // Assert
    expect(block.lines).toEqual([
      "model Abc {",
      "  field1: string",
      "  field2: number",
      '  @@map("abc")',
      "}",
    ]);
  });
  test("modify", () => {
    // Arrange
    const block = new Block("model", [
      "model Abc {",
      "  field1: string",
      "  field2: number",
      '  @@map("XXX")',
      "}",
    ]);
    const modifier = (blockName: string) => blockName.toLowerCase();

    // Act
    changeBlockMap(block, modifier);

    // Assert
    expect(block.lines).toEqual([
      "model Abc {",
      "  field1: string",
      "  field2: number",
      '  @@map("abc")',
      "}",
    ]);
  });
  test("block name none", () => {
    // Arrange
    const block = new Block("none", ["// aaaa"]);
    const modifier = (blockName: string) => blockName.toLowerCase();

    // Act
    changeBlockMap(block, modifier);

    // Assert
    expect(block.lines).toEqual(["// aaaa"]);
  });
});
