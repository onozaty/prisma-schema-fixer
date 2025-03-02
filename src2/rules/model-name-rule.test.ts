import { Block } from "../block";
import { ModelNameRule } from "./model-name-rule";

describe("apply", () => {
  test("case", () => {
    // Arrange
    const configs: ModelNameRule.Config[] = [{ case: "pascal" }];
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
    ModelNameRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual([
      "model UserProfile {",
      "  id   Int      @id @default(autoincrement())",
      "  name String?",
      "}",
    ]);
  });

  test("form", () => {
    // Arrange
    const configs: ModelNameRule.Config[] = [{ form: "plural" }];
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
    ModelNameRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual([
      "model userProfiles {",
      "  id   Int      @id @default(autoincrement())",
      "  name String?",
      "}",
    ]);
  });

  test("case & form", () => {
    // Arrange
    const configs: ModelNameRule.Config[] = [
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
    ModelNameRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual([
      "model user_profile {",
      "  id   Int      @id @default(autoincrement())",
      "  name String?",
      "}",
    ]);
  });

  test("non model", () => {
    // Arrange
    const configs: ModelNameRule.Config[] = [{ form: "plural" }];
    const block: Block = {
      type: "enum",
      lines: ["enum Role {", "  USER", "  ADMIN", "}"],
    };

    // Act
    ModelNameRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual(["enum Role {", "  USER", "  ADMIN", "}"]);
  });

  test("configs", () => {
    // Arrange
    const configs: ModelNameRule.Config[] = [
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
    ModelNameRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual([
      "model user_profile {",
      "  id   Int      @id @default(autoincrement())",
      "  name String?",
      "}",
    ]);
  });

  test("configs - default", () => {
    // Arrange
    const configs: ModelNameRule.Config[] = [
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
    ModelNameRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual([
      "model UserProfile {",
      "  id   Int      @id @default(autoincrement())",
      "  name String?",
      "}",
    ]);
  });

  test("configs - miss", () => {
    // Arrange
    const configs: ModelNameRule.Config[] = [
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
    ModelNameRule.apply(configs, block);

    // Assert
    expect(block.lines).toEqual([
      "model userProfile {",
      "  id   Int      @id @default(autoincrement())",
      "  name String?",
      "}",
    ]);
  });
});
