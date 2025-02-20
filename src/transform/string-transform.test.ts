import { Case, changeCase, changeForm, Form } from "./transform";

describe("changeCase", () => {
  test("should convert string to pascal case", () => {
    // Arrange
    const str = "hello_world";
    const to: Case = "pascal";

    // Act/Assert
    expect(changeCase(str, to)).toBe("HelloWorld");
  });

  test("should convert string to camel case", () => {
    // Arrange
    const str = "hello_world";
    const to: Case = "camel";

    // Act/Assert
    expect(changeCase(str, to)).toBe("helloWorld");
  });

  test("should convert string to snake case", () => {
    // Arrange
    const str = "HelloWorld";
    const to: Case = "snake";

    // Act/Assert
    expect(changeCase(str, to)).toBe("hello_world");
  });
});

describe("changeForm", () => {
  test("should convert string to singular form", () => {
    // Arrange
    const str = "users";
    const to: Form = "singular";

    // Act/Assert
    expect(changeForm(str, to)).toBe("user");
  });

  test("should convert string to plural form", () => {
    // Arrange
    const str = "user";
    const to: Form = "plural";

    // Act/Assert
    expect(changeForm(str, to)).toBe("users");
  });
});
