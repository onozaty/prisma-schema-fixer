import fs from "fs";
import path from "path";
import { defineConfig } from "./config";
import { fix } from "./fixer";

describe("fix", () => {
  test("model-name", async () => {
    // Arrange
    const content = readFixture("simple.prisma");
    const config = defineConfig({
      rules: {
        "model-name": [
          {
            case: "pascal",
            form: "singular",
          },
        ],
      },
    });

    // Act
    const result = await fix(content, config);

    // Assert
    expect(result).toMatchSnapshot();
  });
  test("model-map", async () => {
    // Arrange
    const content = readFixture("simple.prisma");
    const config = defineConfig({
      rules: {
        "model-map": [
          {
            case: "snake",
            form: "plural",
          },
        ],
      },
    });

    // Act
    const result = await fix(content, config);

    // Assert
    expect(result).toMatchSnapshot();
  });
  test("field-name", async () => {
    // Arrange
    const content = readFixture("simple.prisma");
    const config = defineConfig({
      rules: {
        "field-name": [
          {
            case: "pascal",
          },
        ],
      },
    });

    // Act
    const result = await fix(content, config);

    // Assert
    expect(result).toMatchSnapshot();
  });
  test("field-map", async () => {
    // Arrange
    const content = readFixture("simple.prisma");
    const config = defineConfig({
      rules: {
        "field-map": [
          {
            case: "snake",
          },
        ],
      },
    });

    // Act
    const result = await fix(content, config);

    // Assert
    expect(result).toMatchSnapshot();
  });
  test("enum-name", async () => {
    // Arrange
    const content = readFixture("simple.prisma");
    const config = defineConfig({
      rules: {
        "enum-name": [
          {
            case: "pascal",
            form: "plural",
          },
        ],
      },
    });

    // Act
    const result = await fix(content, config);

    // Assert
    expect(result).toMatchSnapshot();
  });
  test("enum-map", async () => {
    // Arrange
    const content = readFixture("simple.prisma");
    const config = defineConfig({
      rules: {
        "enum-map": [
          {
            case: "snake",
            form: "singular",
          },
        ],
      },
    });

    // Act
    const result = await fix(content, config);

    // Assert
    expect(result).toMatchSnapshot();
  });
  test("all", async () => {
    // Arrange
    const content = readFixture("simple.prisma");
    const config = defineConfig({
      rules: {
        "model-name": [
          {
            case: "pascal",
            form: "singular",
          },
        ],
        "model-map": [
          {
            case: "snake",
            form: "plural",
          },
        ],
        "field-name": [
          {
            case: "camel",
          },
        ],
        "field-map": [
          {
            case: "snake",
          },
        ],
        "enum-name": [
          {
            case: "pascal",
            form: "singular",
          },
        ],
        "enum-map": [
          {
            case: "snake",
            form: "plural",
          },
        ],
      },
    });

    // Act
    const result = await fix(content, config);

    // Assert
    expect(result).toMatchSnapshot();
  });
});

const readFixture = (name: string): string => {
  const fixturePath = path.join(__dirname, "__fixtures__", name);
  return fs.readFileSync(fixturePath, "utf-8");
};
