import { Block } from "../blocks/block";
import { ModelBlock } from "../blocks/model-block";

export const changeModelName = (
  blocks: Block[],
  from: string,
  to: string,
): void => {
  for (const modelBlock of ModelBlock.filter(blocks)) {
    // change model name
    if (modelBlock.getModelName() === from) {
      modelBlock.setModelName(to);
    }

    // change field type
    const fields = modelBlock.getFieldLines();
    for (const field of fields) {
      const beforeFileType = field.getFieldType();
      if (trimFieldType(beforeFileType) === from) {
        // keep array and nullable
        field.setFieldType(beforeFileType.replace(from, to));
      }
    }
  }
};

export const changeFieldName = (
  blocks: Block[],
  modelName: string,
  from: string,
  to: string,
): void => {
  for (const modekBlock of ModelBlock.filter(blocks)) {
    if (modekBlock.getModelName() === modelName) {
      const fields = modekBlock.getFieldLines();
      for (const field of fields) {
        // change field name
        if (field.getFieldName() === from) {
          field.setFieldName(to);
        }

        // change relation fields
        const relationFields = field.getRelationFields();
        if (relationFields !== undefined && relationFields.includes(from)) {
          field.setRelationFields(
            relationFields.map((field) => (field === from ? to : field)),
          );
        }
      }
    } else {
      const fields = modekBlock.getFieldLines();
      for (const field of fields) {
        // change relation references
        if (trimFieldType(field.getFieldType()) === modelName) {
          const relationReferences = field.getRelationReferences();
          if (
            relationReferences !== undefined &&
            relationReferences.includes(from)
          ) {
            field.setRelationReferences(
              relationReferences.map((reference) =>
                reference === from ? to : reference,
              ),
            );
          }
        }
      }
    }
  }
};

const trimFieldType = (fieldType: string): string => {
  return fieldType.replace("[]", "").replace("?", "");
};
