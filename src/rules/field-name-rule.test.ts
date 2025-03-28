import { Block } from "../blocks/block";
import { EnumBlock } from "../blocks/enum-block";
import { ModelBlock } from "../blocks/model-block";
import { NoneBlock } from "../blocks/none-block";
import { OtherBlock } from "../blocks/other-block";
import { FieldNameRule } from "./field-name-rule";

describe("apply", () => {
  test("case", () => {
    // Arrange
    const configs: FieldNameRule.Config[] = [{ case: "camel" }];
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  Id        Int      @id @default(autoincrement())",
        "  CreatedAt DateTime @default(now())",
        "  email     String   @unique",
        "  profile   UserProfile?",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id      Int    @id @default(autoincrement())",
        "  name    String?",
        "  User    User   @relation(fields: [user_id], references: [Id])",
        "  user_id Int    @unique",
        "}",
      ]),
      new EnumBlock(["enum User {", "  USER", "  ADMIN", "}"]),
      new OtherBlock(["other User  {", "}"]),
      new NoneBlock(["// User"]),
    ];

    // Act
    FieldNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      "  id        Int      @id @default(autoincrement())",
      "  createdAt DateTime @default(now())",
      "  email     String   @unique",
      "  profile   UserProfile?",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfile {",
      "  id      Int    @id @default(autoincrement())",
      "  name    String?",
      "  user    User   @relation(fields: [userId], references: [id])",
      "  userId Int    @unique",
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

  test("func", () => {
    // Arrange
    const configs: FieldNameRule.Config[] = [{ func: (v) => v.toUpperCase() }];
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  Id        Int      @id @default(autoincrement())",
        "  CreatedAt DateTime @default(now())",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id   Int    @id @default(autoincrement())",
        "  name String?",
        "  @@unique([name])",
        "}",
      ]),
    ];

    // Act
    FieldNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      "  ID        Int      @id @default(autoincrement())",
      "  CREATEDAT DateTime @default(now())",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfile {",
      "  ID   Int    @id @default(autoincrement())",
      "  NAME String?",
      "  @@unique([NAME])",
      "}",
    ]);
  });

  test("pluralize", () => {
    // Arrange
    const configs: FieldNameRule.Config[] = [{ pluralize: true }];
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  id     Int   @id @default(autoincrement())",
        "  number Int[]",
        "  string String[]?",
        "}",
      ]),
    ];

    // Act
    FieldNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      "  id     Int   @id @default(autoincrement())",
      "  numbers Int[]",
      "  strings String[]?",
      "}",
    ]);
  });

  test("case & pluralize & func", () => {
    // Arrange
    const configs: FieldNameRule.Config[] = [
      { case: "snake", pluralize: true, func: (v) => v.toUpperCase() },
    ];
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  Id        Int      @id @default(autoincrement())",
        "  number    Int[]",
        "  CreatedAt DateTime @default(now())",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id   Int    @id @default(autoincrement())",
        "  name String?",
        "}",
      ]),
    ];

    // Act
    FieldNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      "  ID        Int      @id @default(autoincrement())",
      "  NUMBERS    Int[]",
      "  CREATED_AT DateTime @default(now())",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfile {",
      "  ID   Int    @id @default(autoincrement())",
      "  NAME String?",
      "}",
    ]);
  });

  test("configs", () => {
    // Arrange
    const configs: FieldNameRule.Config[] = [
      { case: "camel" },
      { targets: { model: "UserProfile" }, case: "snake" },
      {
        targets: [
          { model: "UserProfile", field: "id" },
          { model: /User/, field: "address" },
        ],
        case: "pascal",
      },
      { targets: { model: "User", field: "Email" }, case: "snake" },
    ];
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  Id        Int      @id @default(autoincrement())",
        "  CreatedAt DateTime @default(now())",
        "  Email     String   @unique",
        "  profile   UserProfile?",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id        Int      @id @default(autoincrement())",
        "  Name      String",
        "  address   String?",
        "  /// comment",
        "  birthDay  DateTime",
        "  // comment",
        "  createdAt DateTime @default(now())",
        "}",
      ]),
    ];

    // Act
    FieldNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      "  id        Int      @id @default(autoincrement())",
      "  createdAt DateTime @default(now())",
      "  email     String   @unique",
      "  profile   UserProfile?",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfile {",
      "  Id        Int      @id @default(autoincrement())",
      "  name      String",
      "  Address   String?",
      "  /// comment",
      "  birth_day  DateTime",
      "  // comment",
      "  created_at DateTime @default(now())",
      "}",
    ]);
  });

  test("configs - exclude", () => {
    // Arrange
    const configs: FieldNameRule.Config[] = [
      { case: "pascal" },
      { targets: { model: "UserProfile" } },
      { targets: { model: "User", field: "email" } },
    ];
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  id        Int      @id @default(autoincrement())",
        "  createdAt DateTime @default(now())",
        "  email     String   @unique",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id   Int    @id @default(autoincrement())",
        "  name String",
        "}",
      ]),
    ];

    // Act
    FieldNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      "  Id        Int      @id @default(autoincrement())",
      "  CreatedAt DateTime @default(now())",
      "  email     String   @unique",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfile {",
      "  id   Int    @id @default(autoincrement())",
      "  name String",
      "}",
    ]);
  });

  test("configs - miss", () => {
    // Arrange
    const configs: FieldNameRule.Config[] = [
      { targets: { model: "userProfile" }, case: "snake" },
      { targets: { model: "User", field: "Email" }, case: "snake" },
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
        "  id        Int      @id @default(autoincrement())",
        "  Name      String",
        "  address   String?",
        "}",
      ]),
    ];

    // Act
    FieldNameRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      "  id    Int    @id @default(autoincrement())",
      "  email String @unique",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfile {",
      "  id        Int      @id @default(autoincrement())",
      "  Name      String",
      "  address   String?",
      "}",
    ]);
  });
});
