import fs from "fs";
import path from "path";
import { Block } from "./block";
import { parseBlocks } from "./parser";

describe("parseBlocks", () => {
  test("simple", async () => {
    // Arrange
    const schemaContent = readFixture("simple.prisma");

    // Act
    const blocks = parseBlocks(schemaContent);

    // Assert
    expect(blocks).toEqual([
      new Block("datasource", [
        "datasource db {",
        '  provider = "postgresql"',
        '  url      = env("DATABASE_URL")',
        "}",
      ]),
      new Block("none", [""]),
      new Block("generator", [
        "generator client {",
        '  provider = "prisma-client-js"',
        "}",
      ]),
      new Block("none", [""]),
      new Block("model", [
        "model Users {",
        "  id        Int      @id @default(autoincrement())",
        "  createdAt DateTime @default(now())",
        "  email     String   @unique",
        "  role      Role     @default(USER)",
        "  posts     Post[]",
        "  profile   UserProfile?",
        "}",
      ]),
      new Block("none", [""]),
      new Block("model", [
        "model userProfile {",
        "  id     Int    @id @default(autoincrement())",
        "  name   String?",
        "  bio    String?",
        "  user   User   @relation(fields: [userId], references: [id])",
        "  userId Int    @unique",
        "}",
      ]),
      new Block("none", [""]),
      new Block("model", [
        "model post {",
        "  id        Int      @id @default(autoincrement())",
        "  createdAt DateTime @default(now())",
        "  updatedAt DateTime @updatedAt",
        "  published Boolean  @default(false)",
        "  title     String   @db.VarChar(255)",
        "  author    User?    @relation(fields: [authorId], references: [id])",
        "  authorId  Int?",
        "}",
      ]),
      new Block("none", [""]),
      new Block("enum", ["enum Role {", "  USER", "  ADMIN", "}"]),
    ]);
  });

  test("view", async () => {
    // Arrange
    const schemaContent = readFixture("view.prisma");

    // Act
    const blocks = parseBlocks(schemaContent);

    // Assert
    expect(blocks).toEqual([
      new Block("datasource", [
        "datasource db {",
        '  provider = "postgresql"',
        '  url      = env("DATABASE_URL")',
        "}",
      ]),
      new Block("none", [""]),
      new Block("generator", [
        "generator client {",
        '  provider        = "prisma-client-js"',
        '  previewFeatures = ["views"]',
        "}",
      ]),
      new Block("none", [""]),
      new Block("model", [
        "model User {",
        "  id      Int      @id @default(autoincrement())",
        "  email   String   @unique",
        "  name    String?",
        "  profile Profile?",
        "}",
      ]),
      new Block("none", [""]),
      new Block("model", [
        "model Profile {",
        "  id     Int    @id @default(autoincrement())",
        "  bio    String",
        "  user   User   @relation(fields: [userId], references: [id])",
        "  userId Int    @unique",
        "}",
      ]),
      new Block("none", [""]),
      new Block("other", [
        "view UserInfo {",
        "  id    Int    @unique",
        "  email String",
        "  name  String",
        "  bio   String",
        "}",
      ]),
      new Block("none", [""]),
    ]);
  });
});

const readFixture = (name: string): string => {
  const fixturePath = path.join(__dirname, "__fixtures__", name);
  return fs.readFileSync(fixturePath, "utf-8");
};
