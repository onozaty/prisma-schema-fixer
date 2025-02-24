import fs from "fs";
import path from "path";
import { defineConfig } from "./config";
import { correction } from "./corrector";

describe("correction", () => {
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
    const result = await correction(content, config);

    // Assert
    expect(result).toMatchSnapshot();
  });
});

const readFixture = (name: string): string => {
  const fixturePath = path.join(__dirname, "__fixtures__", name);
  return fs.readFileSync(fixturePath, "utf-8");
};
