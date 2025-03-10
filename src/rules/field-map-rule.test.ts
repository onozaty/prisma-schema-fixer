import { Block } from "../blocks/block";
import { EnumBlock } from "../blocks/enum-block";
import { ModelBlock } from "../blocks/model-block";
import { NoneBlock } from "../blocks/none-block";
import { OtherBlock } from "../blocks/other-block";
import { FieldMapRule } from "./field-map-rule";

describe("apply", () => {
  test("case", () => {
    // Arrange
    const configs: FieldMapRule.Config[] = [{ case: "pascal" }];
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  id        Int      @id @default(autoincrement())",
        "  createdAt DateTime @default(now())",
        '  email     String   @unique @map("email_address")',
        "  role      Role     @default(USER)",
        `  position  Unsupported("circle") @default(dbgenerated("'<(10,4),11>'::circle"))`,
        "  posts     Post[]",
        "  profile   UserProfile?",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id          Int    @id @default(autoincrement())",
        "  createdAt   DateTime @default(now())",
        "  Bio         String?",
        "  companyName String?",
        "  user        User   @relation(fields: [userId], references: [id])",
        "  userId      Int    @unique",
        "}",
      ]),

      new EnumBlock(["enum Role {", "  USER", "  ADMIN", "}"]),
      new OtherBlock(["other xxxx  { abc efg", "}"]),
      new NoneBlock(["// Comment"]),
    ];

    // Act
    FieldMapRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      '  id        Int @map("Id")       @id @default(autoincrement())',
      '  createdAt DateTime @map("CreatedAt")  @default(now())',
      '  email     String   @unique @map("Email")',
      '  role      Role @map("Role")      @default(USER)',
      `  position  Unsupported("circle") @map("Position")  @default(dbgenerated("'<(10,4),11>'::circle"))`,
      "  posts     Post[]",
      "  profile   UserProfile?",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfile {",
      '  id          Int @map("Id")     @id @default(autoincrement())',
      '  createdAt   DateTime @map("CreatedAt")  @default(now())',
      "  Bio         String?",
      '  companyName String? @map("CompanyName") ',
      "  user        User   @relation(fields: [userId], references: [id])",
      '  userId      Int @map("UserId")     @unique',
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual([
      "enum Role {",
      "  USER",
      "  ADMIN",
      "}",
    ]);
    expect(blocks[3].getLines()).toEqual(["other xxxx  { abc efg", "}"]);
    expect(blocks[4].getLines()).toEqual(["// Comment"]);
  });

  test("configs", () => {
    // Arrange
    const configs: FieldMapRule.Config[] = [
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
    FieldMapRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      '  Id        Int @map("id")       @id @default(autoincrement())',
      '  CreatedAt DateTime @map("createdAt")  @default(now())',
      '  Email     String @map("email")    @unique',
      "  profile   UserProfile?",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfile {",
      '  id        Int @map("Id")       @id @default(autoincrement())',
      '  Name      String @map("name") ',
      '  address   String? @map("Address") ',
      "  /// comment",
      '  birthDay  DateTime @map("birth_day") ',
      "  // comment",
      '  createdAt DateTime @map("created_at")  @default(now())',
      "}",
    ]);
  });

  test("configs - exclude", () => {
    // Arrange
    const configs: FieldMapRule.Config[] = [
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
        '  name String @map("XXXX")',
        "}",
      ]),
    ];

    // Act
    FieldMapRule.apply(configs, blocks);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model User {",
      '  id        Int @map("Id")       @id @default(autoincrement())',
      '  createdAt DateTime @map("CreatedAt")  @default(now())',
      "  email     String   @unique",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfile {",
      "  id   Int    @id @default(autoincrement())",
      '  name String @map("XXXX")',
      "}",
    ]);
  });

  test("configs - miss", () => {
    // Arrange
    const configs: FieldMapRule.Config[] = [
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
    FieldMapRule.apply(configs, blocks);

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
