import { Block } from "../blocks/block";
import { ModelBlock } from "../blocks/model-block";

export const changeModelName = (
  blocks: Block[],
  from: string,
  to: string,
): void => {
  for (const block of blocks) {
    if (block instanceof ModelBlock) {
      // change model name
      if (block.getModelName() === from) {
        block.setModelName(to);
      }

      // change field type
      const fields = block.getFieldLines();
      for (const field of fields) {
        const beforeFileType = field.getFieldType();
        if (trimFieldType(beforeFileType) === from) {
          // keep array and nullable
          field.setFieldType(beforeFileType.replace(from, to));
        }
      }
    }
  }
};

const trimFieldType = (fieldType: string): string => {
  return fieldType.replace("[]", "").replace("?", "");
};
