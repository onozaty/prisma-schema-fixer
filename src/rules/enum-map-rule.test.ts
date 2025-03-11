import { Block } from "../blocks/block";
import { EnumBlock } from "../blocks/enum-block";
import { ModelBlock } from "../blocks/model-block";
import { NoneBlock } from "../blocks/none-block";
import { OtherBlock } from "../blocks/other-block";
import { EnumMapRule } from "./enum-map-rule";

describe("apply", () => {
  test("case", () => {
    // Arrange
    const configs: EnumMapRule.Config[] = [{ case: "snake" }];
    const blocks: Block[] = [
      new EnumBlock(["enum User {", "  X", "  Y", "}"]),
      new EnumBlock(["enum UserType {", "  USER", "  ADMIN", "}"]),
      new EnumBlock(["enum x {", "  X", "  Y", '  @@map("XXXX")', "}"]),
      new ModelBlock([
        "model User {",
        "  id    Int    @id @default(autoincrement())",
        "}",
      ]),
      new OtherBlock(["other User  {", "}"]),
      new NoneBlock(["// User"]),
    ];

    // Act
    EnumMapRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "enum User {",
      "  X",
      "  Y",
      '  @@map("user")',
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "enum UserType {",
      "  USER",
      "  ADMIN",
      '  @@map("user_type")',
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual(["enum x {", "  X", "  Y", "  ", "}"]);
    expect(blocks[3].getLines()).toEqual([
      "model User {",
      "  id    Int    @id @default(autoincrement())",
      "}",
    ]);
    expect(blocks[4].getLines()).toEqual(["other User  {", "}"]);
    expect(blocks[5].getLines()).toEqual(["// User"]);
  });

  test("form", () => {
    // Arrange
    const configs: EnumMapRule.Config[] = [{ form: "plural" }];
    const blocks: Block[] = [
      new EnumBlock(["enum User {", "  X", "  Y", "}"]),
      new EnumBlock(["enum UserType {", "  USER", "  ADMIN", "}"]),
      new EnumBlock(["enum xs {", "  X", "  Y", "}"]),
    ];

    // Act
    EnumMapRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "enum User {",
      "  X",
      "  Y",
      '  @@map("Users")',
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "enum UserType {",
      "  USER",
      "  ADMIN",
      '  @@map("UserTypes")',
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual(["enum xs {", "  X", "  Y", "}"]);
  });

  test("func", () => {
    // Arrange
    const configs: EnumMapRule.Config[] = [{ func: (v) => v.toUpperCase() }];
    const blocks: Block[] = [
      new EnumBlock(["enum User {", "  X", "  Y", "}"]),
      new EnumBlock(["enum UserType {", "  USER", "  ADMIN", "}"]),
      new EnumBlock(["enum XS {", "  X", "  Y", "}"]),
    ];

    // Act
    EnumMapRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "enum User {",
      "  X",
      "  Y",
      '  @@map("USER")',
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "enum UserType {",
      "  USER",
      "  ADMIN",
      '  @@map("USERTYPE")',
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual(["enum XS {", "  X", "  Y", "}"]);
  });

  test("case & form", () => {
    // Arrange
    const configs: EnumMapRule.Config[] = [{ case: "snake", form: "plural" }];
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
    EnumMapRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "enum User {",
      "  X",
      "  Y",
      '  @@map("users")',
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "enum UserType {",
      "  USER",
      "  ADMIN",
      '  @@map("user_types") // comment',
      "}",
    ]);
  });

  test("case & form & func", () => {
    // Arrange
    const configs: EnumMapRule.Config[] = [
      { case: "snake", form: "plural", func: (value) => `enum_${value}` },
    ];
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
    EnumMapRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "enum User {",
      "  X",
      "  Y",
      '  @@map("enum_users")',
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "enum UserType {",
      "  USER",
      "  ADMIN",
      '  @@map("enum_user_types") // comment',
      "}",
    ]);
  });

  test("configs", () => {
    // Arrange
    const configs: EnumMapRule.Config[] = [
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
    EnumMapRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "enum XXX {",
      "  X",
      "  Y",
      '  @@map("Xxx")',
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "enum YyyYyy {",
      "  X",
      "  Y",
      '  @@map("yyy_yyys")',
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual([
      "enum Zzz {",
      "  X",
      "  Y",
      '  @@map("zzz")',
      "}",
    ]);
  });

  test("configs - exclude", () => {
    // Arrange
    const configs: EnumMapRule.Config[] = [
      { case: "pascal" },
      { targets: ["YyyYyy"] },
    ];
    const blocks: Block[] = [
      new EnumBlock(["enum XXX {", "  X", "  Y", '  @@map("XXXXXX")', "}"]),
      new EnumBlock(["enum YyyYyy {", "  X", "  Y", '  @@map("XXXXXX")', "}"]),
      new EnumBlock(["enum Zzz {", "  X", "  Y", '  @@map("XXXXXX")', "}"]),
    ];

    // Act
    EnumMapRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "enum XXX {",
      "  X",
      "  Y",
      '  @@map("Xxx")',
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "enum YyyYyy {",
      "  X",
      "  Y",
      '  @@map("XXXXXX")',
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual([
      "enum Zzz {",
      "  X",
      "  Y",
      "  ",
      "}",
    ]);
  });

  test("configs - miss", () => {
    // Arrange
    const configs: EnumMapRule.Config[] = [
      { targets: ["XX"], case: "snake", form: "plural" },
    ];
    const blocks: Block[] = [new EnumBlock(["enum XXX {", "  X", "  Y", "}"])];

    // Act
    EnumMapRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual(["enum XXX {", "  X", "  Y", "}"]);
  });
});
