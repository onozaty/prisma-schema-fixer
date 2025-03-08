import prismaInternal from "@prisma/internals";

export const formatSchema = async (contents: string) => {
  const formated = await prismaInternal.formatSchema({
    schemas: [["dummy.prisma", contents]],
  });
  return formated[0][1];
};
