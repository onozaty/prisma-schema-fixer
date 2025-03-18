import fs from "fs";
import path from "path";
import { EnumBlock } from "./blocks/enum-block";
import { ModelBlock } from "./blocks/model-block";
import { NoneBlock } from "./blocks/none-block";
import { OtherBlock } from "./blocks/other-block";
import { parseBlocks } from "./parser";

describe("parseBlocks", () => {
  test("simple", async () => {
    // Arrange
    const schemaContent = readFixture("simple.prisma");

    // Act
    const blocks = parseBlocks(schemaContent);

    // Assert
    expect(blocks).toEqual([
      new OtherBlock([
        "datasource db {",
        '  provider = "postgresql"',
        '  url      = env("DATABASE_URL")',
        "}",
      ]),
      new NoneBlock([""]),
      new OtherBlock([
        "generator client {",
        '  provider = "prisma-client-js"',
        "}",
      ]),
      new NoneBlock([""]),
      new ModelBlock([
        "model Users {",
        "  id        Int      @id @default(autoincrement())",
        "  createdAt DateTime @default(now())",
        "  email     String   @unique",
        "  role      Role     @default(USER)",
        "  posts     Post[]",
        "  profile   UserProfile?",
        "}",
      ]),
      new NoneBlock([""]),
      new ModelBlock([
        "model userProfile {",
        "  id     Int    @id @default(autoincrement())",
        "  name   String?",
        "  bio    String?",
        "  user   User   @relation(fields: [userId], references: [id])",
        "  userId Int    @unique",
        "}",
      ]),
      new NoneBlock([""]),
      new ModelBlock([
        "model post {",
        "  Id        Int      @id @default(autoincrement())",
        "  createdAt DateTime @default(now())",
        "  updatedAt DateTime @updatedAt",
        "  published Boolean  @default(false)",
        "  title     String",
        "  author    User?    @relation(fields: [author_id], references: [id])",
        "  author_id Int?",
        "}",
      ]),
      new NoneBlock([""]),
      new EnumBlock(["enum Role {", "  USER", "  ADMIN", "}"]),
    ]);
  });

  test("view", async () => {
    // Arrange
    const schemaContent = readFixture("view.prisma");

    // Act
    const blocks = parseBlocks(schemaContent);

    // Assert
    expect(blocks).toEqual([
      new OtherBlock([
        "datasource db {",
        '  provider = "postgresql"',
        '  url      = env("DATABASE_URL")',
        "}",
      ]),
      new NoneBlock([""]),
      new OtherBlock([
        "generator client {",
        '  provider        = "prisma-client-js"',
        '  previewFeatures = ["views"]',
        "}",
      ]),
      new NoneBlock([""]),
      new ModelBlock([
        "model User {",
        "  id      Int      @id @default(autoincrement())",
        "  email   String   @unique",
        "  name    String?",
        "  profile Profile?",
        "}",
      ]),
      new NoneBlock([""]),
      new ModelBlock([
        "model Profile {",
        "  id     Int    @id @default(autoincrement())",
        "  bio    String",
        "  user   User   @relation(fields: [userId], references: [id])",
        "  userId Int    @unique",
        "}",
      ]),
      new NoneBlock([""]),
      new OtherBlock([
        "view UserInfo {",
        "  id    Int    @unique",
        "  email String",
        "  name  String",
        "  bio   String",
        "}",
      ]),
      new NoneBlock([""]),
    ]);
  });
});

const readFixture = (name: string): string => {
  const fixturePath = path.join(__dirname, "__fixtures__", name);
  return fs.readFileSync(fixturePath, "utf-8");
};
