import { Block } from "../block";
import {
  changeBlockMap,
  changeBlockName,
  changeFieldMap,
  changeFieldName,
} from "./block-transform";

describe("changeBlockName", () => {
  test("normal", () => {
    // Arrange
    const block = new Block("model", [
      "model abc {",
      "  field1 string",
      "  field2 number",
      "}",
    ]);
    const modifier = (beforeName: string) => beforeName.toUpperCase();

    // Act
    changeBlockName(block, modifier);

    // Assert
    expect(block.lines).toEqual([
      "model ABC {",
      "  field1 string",
      "  field2 number",
      "}",
    ]);
  });
  test("block name none", () => {
    // Arrange
    const block = new Block("model", [
      "model abc",
      "  field1 string",
      "  field2 number",
      "}",
    ]);
    const modifier = (beforeName: string) => beforeName.toUpperCase();

    // Act
    changeBlockName(block, modifier);

    // Assert
    expect(block.lines).toEqual([
      "model abc",
      "  field1 string",
      "  field2 number",
      "}",
    ]);
  });
});

describe("changeBlockMap", () => {
  test("add", () => {
    // Arrange
    const block = new Block("model", [
      "model Abc {",
      "  field1 string",
      "  field2 number",
      "}",
    ]);
    const modifier = (blockName: string) => blockName.toLowerCase();

    // Act
    changeBlockMap(block, modifier);

    // Assert
    expect(block.lines).toEqual([
      "model Abc {",
      "  field1 string",
      "  field2 number",
      '  @@map("abc")',
      "}",
    ]);
  });
  test("modify", () => {
    // Arrange
    const block = new Block("model", [
      "model Abc {",
      "  field1 string",
      "  field2 number",
      '  @@map("XXX")',
      "}",
    ]);
    const modifier = (blockName: string) => blockName.toLowerCase();

    // Act
    changeBlockMap(block, modifier);

    // Assert
    expect(block.lines).toEqual([
      "model Abc {",
      "  field1 string",
      "  field2 number",
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

describe("changeFieldName", () => {
  test("normal", () => {
    // Arrange
    const block = new Block("model", [
      "model abc {",
      "  field1 string",
      "  field2 number",
      "}",
    ]);
    const modifier = (model: string, field: string) => field.toUpperCase();

    // Act
    changeFieldName(block, modifier);

    // Assert
    expect(block.lines).toEqual([
      "model abc {",
      "  FIELD1 string",
      "  FIELD2 number",
      "}",
    ]);
  });
  test("block name none", () => {
    // Arrange
    const block = new Block("model", [
      "model abc",
      "  field1 string",
      "  field2 number",
      "}",
    ]);
    const modifier = (model: string, field: string) => field.toUpperCase();

    // Act
    changeFieldName(block, modifier);

    // Assert
    expect(block.lines).toEqual([
      "model abc",
      "  field1 string",
      "  field2 number",
      "}",
    ]);
  });
});

describe("changeFieldMap", () => {
  test("add", () => {
    // Arrange
    const block = new Block("model", [
      "model Abc {",
      "  Field1 string",
      "  field2 number",
      "}",
    ]);
    const modifier = (model: string, field: string) => field.toLowerCase();

    // Act
    changeFieldMap(block, modifier);

    // Assert
    expect(block.lines).toEqual([
      "model Abc {",
      '  Field1 string @map("field1")',
      '  field2 number @map("field2")',
      "}",
    ]);
  });
  test("modify", () => {
    // Arrange
    const block = new Block("model", [
      "model Abc {",
      '  Field1 string @map("XXX") @db.Text',
      '  field2 number @map("YYY")',
      "}",
    ]);
    const modifier = (model: string, field: string) => field.toLowerCase();

    // Act
    changeFieldMap(block, modifier);

    // Assert
    expect(block.lines).toEqual([
      "model Abc {",
      '  Field1 string @map("field1") @db.Text',
      '  field2 number @map("field2")',
      "}",
    ]);
  });
  test("block name none", () => {
    // Arrange
    const block = new Block("none", ["// aaaa"]);
    const modifier = (model: string, field: string) => field.toLowerCase();

    // Act
    changeFieldMap(block, modifier);

    // Assert
    expect(block.lines).toEqual(["// aaaa"]);
  });
});
