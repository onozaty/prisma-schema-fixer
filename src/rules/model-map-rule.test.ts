import { Block } from "../block";
import { ModelMapRule } from "./model-map-rule";

describe("apply", () => {
  test("case", () => {
    // Arrange
    const configs: ModelMapRule.Config[] = [{ case: "pascal" }];
    const block: Block = {
      type: "model",
      lines: [
        "model userProfile {",
        "  id   Int      @id @default(autoincrement())",
        "  name String?",
        "}",
      ],
    };

    // Act
    ModelMapRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual([
      "model userProfile {",
      "  id   Int      @id @default(autoincrement())",
      "  name String?",
      '  @@map("UserProfile")',
      "}",
    ]);
  });

  test("form", () => {
    // Arrange
    const configs: ModelMapRule.Config[] = [{ form: "plural" }];
    const block: Block = {
      type: "model",
      lines: [
        "model userProfile {",
        "  id   Int      @id @default(autoincrement())",
        "  name String?",
        "}",
      ],
    };

    // Act
    ModelMapRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual([
      "model userProfile {",
      "  id   Int      @id @default(autoincrement())",
      "  name String?",
      '  @@map("userProfiles")',
      "}",
    ]);
  });

  test("case & form", () => {
    // Arrange
    const configs: ModelMapRule.Config[] = [
      { case: "snake", form: "singular" },
    ];
    const block: Block = {
      type: "model",
      lines: [
        "model userProfiles {",
        "  id   Int      @id @default(autoincrement())",
        "  name String?",
        "}",
      ],
    };

    // Act
    ModelMapRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual([
      "model userProfiles {",
      "  id   Int      @id @default(autoincrement())",
      "  name String?",
      '  @@map("user_profile")',
      "}",
    ]);
  });

  test("non model", () => {
    // Arrange
    const configs: ModelMapRule.Config[] = [{ form: "plural" }];
    const block: Block = {
      type: "enum",
      lines: ["enum Role {", "  USER", "  ADMIN", "}"],
    };

    // Act
    ModelMapRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual(["enum Role {", "  USER", "  ADMIN", "}"]);
  });

  test("configs", () => {
    // Arrange
    const configs: ModelMapRule.Config[] = [
      { case: "pascal" },
      { targets: ["userProfile"], case: "snake" },
      { targets: ["user"], case: "pascal" },
    ];
    const block: Block = {
      type: "model",
      lines: [
        "model userProfile {",
        "  id   Int      @id @default(autoincrement())",
        "  name String?",
        "}",
      ],
    };

    // Act
    ModelMapRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual([
      "model userProfile {",
      "  id   Int      @id @default(autoincrement())",
      "  name String?",
      '  @@map("user_profile")',
      "}",
    ]);
  });

  test("configs - default", () => {
    // Arrange
    const configs: ModelMapRule.Config[] = [
      { case: "pascal" },
      { targets: ["UserProfile"], case: "snake" },
      { targets: ["user"], case: "snake" },
    ];
    const block: Block = {
      type: "model",
      lines: [
        "model userProfile {",
        "  id   Int      @id @default(autoincrement())",
        "  name String?",
        "}",
      ],
    };

    // Act
    ModelMapRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual([
      "model userProfile {",
      "  id   Int      @id @default(autoincrement())",
      "  name String?",
      '  @@map("UserProfile")',
      "}",
    ]);
  });

  test("configs - miss", () => {
    // Arrange
    const configs: ModelMapRule.Config[] = [
      { targets: ["UserProfile"], case: "snake" },
      { targets: ["user"], case: "snake" },
    ];
    const block: Block = {
      type: "model",
      lines: [
        "model userProfile {",
        "  id   Int      @id @default(autoincrement())",
        "  name String?",
        "}",
      ],
    };

    // Act
    ModelMapRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual([
      "model userProfile {",
      "  id   Int      @id @default(autoincrement())",
      "  name String?",
      "}",
    ]);
  });
});
