import { formatSchema } from "./schema";

test("formatSchema", async () => {
  // Arrange
  const contents = `
      model Customer { 
      id Int @id 
      }
    `;

  // Act
  const formatted = await formatSchema(contents);

  // Assert
  expect(formatted).toBe(`model Customer {
  id Int @id
}
`);
});
