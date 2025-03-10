import { Block } from "../blocks/block";
import { EnumBlock } from "../blocks/enum-block";
import { ModelBlock } from "../blocks/model-block";
import { NoneBlock } from "../blocks/none-block";
import { OtherBlock } from "../blocks/other-block";
import { EnumNameRule } from "./enuml-name-rule";

describe("apply", () => {
  test("case", () => {
    // Arrange
    const configs: EnumNameRule.Config[] = [{ case: "snake" }];
    const blocks: Block[] = [
      new EnumBlock(["enum User {", "  X", "  Y", "}"]),
      new EnumBlock(["enum UserType {", "  USER", "  ADMIN", "}"]),
      new ModelBlock([
        "model User {",
        "  id    Int    @id @default(autoincrement())",
        "}",
      ]),
      new OtherBlock(["other User  {", "}"]),
      new NoneBlock(["// User"]),
    ];

    // Act
    EnumNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual(["enum user {", "  X", "  Y", "}"]);
    expect(blocks[1].getLines()).toEqual([
      "enum user_type {",
      "  USER",
      "  ADMIN",
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual([
      "model User {",
      "  id    Int    @id @default(autoincrement())",
      "}",
    ]);
    expect(blocks[3].getLines()).toEqual(["other User  {", "}"]);
    expect(blocks[4].getLines()).toEqual(["// User"]);
  });

  test("form", () => {
    // Arrange
    const configs: EnumNameRule.Config[] = [{ form: "plural" }];
    const blocks: Block[] = [
      new EnumBlock(["enum User {", "  X", "  Y", "}"]),
      new EnumBlock(["enum UserType {", "  USER", "  ADMIN", "}"]),
    ];

    // Act
    EnumNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual(["enum Users {", "  X", "  Y", "}"]);
    expect(blocks[1].getLines()).toEqual([
      "enum UserTypes {",
      "  USER",
      "  ADMIN",
      "}",
    ]);
  });

  test("case & form", () => {
    // Arrange
    const configs: EnumNameRule.Config[] = [{ case: "snake", form: "plural" }];
    const blocks: Block[] = [
      new EnumBlock(["enum User {", "  X", "  Y", "}"]),
      new EnumBlock([
        "enum UserType {",
        "  USER",
        "  ADMIN",
        '  @@map("xxxx") // comment',
        "}",
      ]),
    ];

    // Act
    EnumNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual(["enum users {", "  X", "  Y", "}"]);
    expect(blocks[1].getLines()).toEqual([
      "enum user_types {",
      "  USER",
      "  ADMIN",
      '  @@map("xxxx") // comment',
      "}",
    ]);
  });

  test("configs", () => {
    // Arrange
    const configs: EnumNameRule.Config[] = [
      { case: "camel" },
      { targets: ["YyyYyy"], case: "snake", form: "plural" },
      { targets: /X/, case: "pascal" },
    ];
    const blocks: Block[] = [
      new EnumBlock(["enum XXX {", "  X", "  Y", "}"]),
      new EnumBlock(["enum YyyYyy {", "  X", "  Y", "}"]),
      new EnumBlock(["enum Zzz {", "  X", "  Y", "}"]),
    ];

    // Act
    EnumNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual(["enum Xxx {", "  X", "  Y", "}"]);
    expect(blocks[1].getLines()).toEqual([
      "enum yyy_yyys {",
      "  X",
      "  Y",
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual(["enum zzz {", "  X", "  Y", "}"]);
  });

  test("configs - exclude", () => {
    // Arrange
    const configs: EnumNameRule.Config[] = [
      { case: "pascal" },
      { targets: ["yyy"] },
    ];
    const blocks: Block[] = [
      new EnumBlock(["enum XXX {", "  X", "  Y", "}"]),
      new EnumBlock(["enum yyy {", "  X", "  Y", "}"]),
      new EnumBlock(["enum Zzz {", "  X", "  Y", "}"]),
    ];

    // Act
    EnumNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual(["enum Xxx {", "  X", "  Y", "}"]);
    expect(blocks[1].getLines()).toEqual(["enum yyy {", "  X", "  Y", "}"]);
    expect(blocks[2].getLines()).toEqual(["enum Zzz {", "  X", "  Y", "}"]);
  });

  test("configs - miss", () => {
    // Arrange
    const configs: EnumNameRule.Config[] = [
      { targets: ["XX"], case: "snake", form: "plural" },
    ];
    const blocks: Block[] = [new EnumBlock(["enum XXX {", "  X", "  Y", "}"])];

    // Act
    EnumNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual(["enum XXX {", "  X", "  Y", "}"]);
  });
});
