import { Block } from "../blocks/block";
import { EnumBlock } from "../blocks/enum-block";
import { ModelBlock } from "../blocks/model-block";
import { NoneBlock } from "../blocks/none-block";
import { OtherBlock } from "../blocks/other-block";
import { changeFieldName, changeModelName } from "./block-transform";

describe("changeModelName", () => {
  test("model name", () => {
    // Arrange
    const blocks: Block[] = [
      new ModelBlock([
        "model User {",
        "  id        Int      @id @default(autoincrement())",
        "  name      String?",
        "}",
      ]),
      new ModelBlock([
        "model UserProfile {",
        "  id        Int      @id @default(autoincrement())",
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
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model UserProfile {",
      "  id        Int      @id @default(autoincrement())",
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

describe("changeFieldName", () => {
  test("field", () => {
    // Arrange
    const blocks: Block[] = [
      new ModelBlock([
        "model Xx {",
        "  id  Int      @id @default(autoincrement())",
        "  a   DateTime @default(now())",
        "}",
      ]),
      new ModelBlock([
        "model X {",
        "  id  Int      @id @default(autoincrement())",
        "  a   DateTime @default(now())",
        "  aa  DateTime @default(now())",
        "  aaa DateTime @default(now())",
        "}",
      ]),
      new EnumBlock(["enum X {", "  a", "}"]),
      new OtherBlock(["other X {", "  a", "}"]),
      new NoneBlock(["// X a"]),
    ];
    const modelName = "X";
    const from = "a";
    const to = "aTo";

    // Act
    changeFieldName(blocks, modelName, from, to);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model Xx {",
      "  id  Int      @id @default(autoincrement())",
      "  a   DateTime @default(now())",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model X {",
      "  id  Int      @id @default(autoincrement())",
      "  aTo   DateTime @default(now())",
      "  aa  DateTime @default(now())",
      "  aaa DateTime @default(now())",
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual(["enum X {", "  a", "}"]);
    expect(blocks[3].getLines()).toEqual(["other X {", "  a", "}"]);
    expect(blocks[4].getLines()).toEqual(["// X a"]);
  });

  test("relation fields", () => {
    // Arrange
    const blocks: Block[] = [
      new ModelBlock([
        "model Xx {",
        "  id1 Int @id @default(autoincrement())",
        "  id2 Int?",
        "  x   X?",
        "}",
      ]),
      new ModelBlock([
        "model X {",
        "  id1  Int  @id @default(autoincrement())",
        "  id2  Int?",
        "  xx   Xx?  @relation(fields: [id1, id2], references: [id1, id2])",
        "  xxx  Xxx? @relation(fields: [id2], references: [id2])",
        "}",
      ]),
      new ModelBlock([
        "model Xxx {",
        "  id1 Int @id @default(autoincrement())",
        "  id2 Int",
        "  x   X[]",
        "}",
      ]),
    ];
    const modelName = "X";
    const from = "id2";
    const to = "id2To";

    // Act
    changeFieldName(blocks, modelName, from, to);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model Xx {",
      "  id1 Int @id @default(autoincrement())",
      "  id2 Int?",
      "  x   X?",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model X {",
      "  id1  Int  @id @default(autoincrement())",
      "  id2To  Int?",
      "  xx   Xx?  @relation(fields: [id1, id2To], references: [id1, id2])",
      "  xxx  Xxx? @relation(fields: [id2To], references: [id2])",
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual([
      "model Xxx {",
      "  id1 Int @id @default(autoincrement())",
      "  id2 Int",
      "  x   X[]",
      "}",
    ]);
  });

  test("relation references", () => {
    // Arrange
    const blocks: Block[] = [
      new ModelBlock([
        "model Xx {",
        "  id1 Int @id @default(autoincrement())",
        "  id2 Int?",
        "  x   X?",
        "}",
      ]),
      new ModelBlock([
        "model X {",
        "  id1  Int  @id @default(autoincrement())",
        "  id2  Int?",
        "  xx   Xx?  @relation(fields: [id1, id2], references: [id1, id2])",
        "  xxx  Xxx? @relation(fields: [id2], references: [id2])",
        "}",
      ]),
      new ModelBlock([
        "model Xxx {",
        "  id1 Int @id @default(autoincrement())",
        "  id2 Int",
        "  x   X[]",
        "}",
      ]),
    ];
    const modelName = "Xx";
    const from = "id2";
    const to = "id2To";

    // Act
    changeFieldName(blocks, modelName, from, to);

    // Assert
    expect(blocks[0].getLines()).toEqual([
      "model Xx {",
      "  id1 Int @id @default(autoincrement())",
      "  id2To Int?",
      "  x   X?",
      "}",
    ]);
    expect(blocks[1].getLines()).toEqual([
      "model X {",
      "  id1  Int  @id @default(autoincrement())",
      "  id2  Int?",
      "  xx   Xx?  @relation(fields: [id1, id2], references: [id1, id2To])",
      "  xxx  Xxx? @relation(fields: [id2], references: [id2])",
      "}",
    ]);
    expect(blocks[2].getLines()).toEqual([
      "model Xxx {",
      "  id1 Int @id @default(autoincrement())",
      "  id2 Int",
      "  x   X[]",
      "}",
    ]);
  });
});
