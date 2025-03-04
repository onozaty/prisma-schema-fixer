import { Block } from "../blocks/block";
import { EnumBlock } from "../blocks/enum-block";
import { ModelBlock } from "../blocks/model-block";
import { NoneBlock } from "../blocks/none-block";
import { OtherBlock } from "../blocks/other-block";
import { changeModelName } from "./block-transform";

describe("changeModelName", () => {
  test("model name", () => {
    // Arrange
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  id        Int      @id @default(autoincrement())",
        "  name      String?",
        "  createdAt DateTime @default(now())",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id        Int      @id @default(autoincrement())",
        "  name      String?",
        "  createdAt DateTime @default(now())",
        "}",
      ]),
      new EnumBlock(["enum User {", "  USER", "  ADMIN", "}"]),
      new OtherBlock(["other User  {", "}"]),
      new NoneBlock(["// User"]),
    ];
    const from = "User";
    const to = "UserTo";

    // Act
    changeModelName(blocks, from, to);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model UserTo {",
      "  id        Int      @id @default(autoincrement())",
      "  name      String?",
      "  createdAt DateTime @default(now())",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfile {",
      "  id        Int      @id @default(autoincrement())",
      "  name      String?",
      "  createdAt DateTime @default(now())",
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

  test("field type", () => {
    // Arrange
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  id        Int      @id @default(autoincrement())",
        "  createdAt DateTime @default(now())",
        "  email     String   @unique",
        "  role      Role     @default(USER)",
        "  posts     Post[]",
        "  profile   UserProfile?",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id     Int    @id @default(autoincrement())",
        "  name   String?",
        "  bio    String?",
        "  user   User   @relation(fields: [user_id], references: [id])",
        "  userId Int    @unique",
        "}",
      ]),
      new ModelBlock([
        "model Post {",
        "  id        Int      @id @default(autoincrement())",
        "  createdAt DateTime @default(now())",
        "  updatedAt DateTime @updatedAt",
        "  published Boolean  @default(false)",
        "  title     String   @db.VarChar(255)",
        "  author    User?    @relation(fields: [authorId], references: [id])",
        "  authorId  Int?",
        "}",
      ]),
      new ModelBlock([
        "model Team {",
        "  id    Int    @id @default(autoincrement())",
        "  name  String @unique",
        "  users User[]",
        "}",
      ]),
    ];

    const from = "User";
    const to = "UserTo";

    // Act
    changeModelName(blocks, from, to);

    expect(blocks[0].getLines()).toEqual([
      "model UserTo {",
      "  id        Int      @id @default(autoincrement())",
      "  createdAt DateTime @default(now())",
      "  email     String   @unique",
      "  role      Role     @default(USER)",
      "  posts     Post[]",
      "  profile   UserProfile?",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfile {",
      "  id     Int    @id @default(autoincrement())",
      "  name   String?",
      "  bio    String?",
      "  user   UserTo   @relation(fields: [user_id], references: [id])",
      "  userId Int    @unique",
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual([
      "model Post {",
      "  id        Int      @id @default(autoincrement())",
      "  createdAt DateTime @default(now())",
      "  updatedAt DateTime @updatedAt",
      "  published Boolean  @default(false)",
      "  title     String   @db.VarChar(255)",
      "  author    UserTo?    @relation(fields: [authorId], references: [id])",
      "  authorId  Int?",
      "}",
    ]);
    expect(blocks[3].getLines()).toEqual([
      "model Team {",
      "  id    Int    @id @default(autoincrement())",
      "  name  String @unique",
      "  users UserTo[]",
      "}",
    ]);
  });
});
