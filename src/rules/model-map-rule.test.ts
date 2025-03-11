import { Block } from "../blocks/block";
import { EnumBlock } from "../blocks/enum-block";
import { ModelBlock } from "../blocks/model-block";
import { NoneBlock } from "../blocks/none-block";
import { OtherBlock } from "../blocks/other-block";
import { ModelMapRule } from "./model-map-rule";

describe("apply", () => {
  test("case", () => {
    // Arrange
    const configs: ModelMapRule.Config[] = [{ case: "snake" }];
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  id    Int    @id @default(autoincrement())",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id     Int    @id @default(autoincrement())",
        "  name   String?",
        '  @@map("XXXX")',
        "}",
      ]),
      new EnumBlock(["enum User {", "  USER", "  ADMIN", "}"]),
      new OtherBlock(["other User  {", "}"]),
      new NoneBlock(["// User"]),
    ];

    // Act
    ModelMapRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      "  id    Int    @id @default(autoincrement())",
      '  @@map("user")',
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfile {",
      "  id     Int    @id @default(autoincrement())",
      "  name   String?",
      '  @@map("user_profile")',
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual([
      "enum User {",
      "  USER",
      "  ADMIN",
      "}",
    ]);
    expect(blocks[3].getLines()).toEqual(["other User  {", "}"]);
    expect(blocks[4].getLines()).toEqual(["// User"]);
  });

  test("form", () => {
    // Arrange
    const configs: ModelMapRule.Config[] = [{ form: "singular" }];
    const blocks: Block[] = [
      new ModelBlock([
        "model Users {",
        "  id    Int    @id @default(autoincrement())",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id     Int    @id @default(autoincrement())",
        "  name   String?",
        '  @@map("XXXX")',
        "}",
      ]),
      new ModelBlock([
        "model A {",
        "  id     Int    @id @default(autoincrement())",
        "}",
      ]),
    ];

    // Act
    ModelMapRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model Users {",
      "  id    Int    @id @default(autoincrement())",
      '  @@map("User")',
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfile {",
      "  id     Int    @id @default(autoincrement())",
      "  name   String?",
      "  ",
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual([
      "model A {",
      "  id     Int    @id @default(autoincrement())",
      "}",
    ]);
  });

  test("func", () => {
    // Arrange
    const configs: ModelMapRule.Config[] = [{ func: (v) => `_${v}_` }];
    const blocks: Block[] = [
      new ModelBlock([
        "model Users {",
        "  id Int @id @default(autoincrement())",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id     Int    @id @default(autoincrement())",
        "  name   String?",
        '  @@map("XXXX")',
        "}",
      ]),
    ];

    // Act
    ModelMapRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model Users {",
      "  id Int @id @default(autoincrement())",
      '  @@map("_Users_")',
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfile {",
      "  id     Int    @id @default(autoincrement())",
      "  name   String?",
      '  @@map("_UserProfile_")',
      "}",
    ]);
  });

  test("case & form", () => {
    // Arrange
    const configs: ModelMapRule.Config[] = [{ case: "snake", form: "plural" }];
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  id Int @id @default(autoincrement())",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id     Int    @id @default(autoincrement())",
        "  name   String?",
        '  @@map("user_profiles")',
        "}",
      ]),
    ];

    // Act
    ModelMapRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      "  id Int @id @default(autoincrement())",
      '  @@map("users")',
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfile {",
      "  id     Int    @id @default(autoincrement())",
      "  name   String?",
      '  @@map("user_profiles")',
      "}",
    ]);
  });

  test("case & form & func", () => {
    // Arrange
    const configs: ModelMapRule.Config[] = [
      { case: "snake", form: "plural", func: (v) => `_${v}` },
    ];
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  id Int @id @default(autoincrement())",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id     Int    @id @default(autoincrement())",
        "  name   String?",
        '  @@map("user_profiles")',
        "}",
      ]),
    ];

    // Act
    ModelMapRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      "  id Int @id @default(autoincrement())",
      '  @@map("_users")',
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfile {",
      "  id     Int    @id @default(autoincrement())",
      "  name   String?",
      '  @@map("_user_profiles")',
      "}",
    ]);
  });

  test("configs", () => {
    // Arrange
    const configs: ModelMapRule.Config[] = [
      { case: "pascal" },
      { targets: ["userProfile"], case: "snake" },
      { targets: ["user"], case: "pascal" },
    ];
    const blocks: Block[] = [
      new ModelBlock([
        "model user {",
        "  id    Int    @id @default(autoincrement())",
        "  email String @unique",
        "}",
      ]),
      new ModelBlock([
        "model userProfile {",
        "  id   Int      @id @default(autoincrement())",
        "  name String?",
        "}",
      ]),
      new ModelBlock([
        "model XXXX {",
        "  id Int @id @default(autoincrement())",
        "}",
      ]),
    ];

    // Act
    ModelMapRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model user {",
      "  id    Int    @id @default(autoincrement())",
      "  email String @unique",
      '  @@map("User")',
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model userProfile {",
      "  id   Int      @id @default(autoincrement())",
      "  name String?",
      '  @@map("user_profile")',
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual([
      "model XXXX {",
      "  id Int @id @default(autoincrement())",
      '  @@map("Xxxx")',
      "}",
    ]);
  });

  test("configs - exclude", () => {
    // Arrange
    const configs: ModelMapRule.Config[] = [
      { case: "snake", form: "plural" },
      { targets: ["UserProfile"] },
    ];
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  id    Int    @id @default(autoincrement())",
        "  email String @unique",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id   Int      @id @default(autoincrement())",
        "  name String?",
        '  @@map("xxxx")',
        "}",
      ]),
      new ModelBlock([
        "model XXXX {",
        "  id Int @id @default(autoincrement())",
        '  @@map("xxxx")',
        "}",
      ]),
    ];

    // Act
    ModelMapRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      "  id    Int    @id @default(autoincrement())",
      "  email String @unique",
      '  @@map("users")',
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfile {",
      "  id   Int      @id @default(autoincrement())",
      "  name String?",
      '  @@map("xxxx")',
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual([
      "model XXXX {",
      "  id Int @id @default(autoincrement())",
      '  @@map("xxxxes")',
      "}",
    ]);
  });

  test("configs - miss", () => {
    // Arrange
    const configs: ModelMapRule.Config[] = [
      { targets: ["UserProfile"], case: "snake" },
      { targets: ["user"], case: "snake" },
    ];
    const blocks: Block[] = [
      new ModelBlock([
        "model userProfile {",
        "  id   Int      @id @default(autoincrement())",
        "  name String?",
        '  @@map("xxxx")',
        "}",
      ]),
    ];

    // Act
    ModelMapRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model userProfile {",
      "  id   Int      @id @default(autoincrement())",
      "  name String?",
      '  @@map("xxxx")',
      "}",
    ]);
  });
});
