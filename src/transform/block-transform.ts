import { Block } from "../blocks/block";
import { EnumBlock } from "../blocks/enum-block";
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
      if (field.getFieldTypeBaseName() === from) {
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

      // change id line
      const idLine = modekBlock.getIdLine();
      if (idLine !== undefined) {
        idLine.fields = idLine.fields.map((field) => {
          if (field === from) {
            return to;
          }
          return field;
        });
      }

      // change unique line
      const uniqueLines = modekBlock.getUniqueLines();
      for (const uniqueLine of uniqueLines) {
        uniqueLine.fields = uniqueLine.fields.map((field) => {
          // id(sort: Desc) -> id
          if (field.replace(/\(.+\)/, "") === from) {
            return field.replace(from, to);
          }
          return field;
        });
      }

      // change index line
      const indexLines = modekBlock.getIndexLines();
      for (const indexLine of indexLines) {
        indexLine.fields = indexLine.fields.map((field) => {
          // id(sort: Desc) -> id
          if (field.replace(/\(.+\)/, "") === from) {
            return field.replace(from, to);
          }
          return field;
        });
      }
    } else {
      const fields = modekBlock.getFieldLines();
      for (const field of fields) {
        // change relation references
        if (field.getFieldTypeBaseName() === modelName) {
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

export const changeEnumName = (
  blocks: Block[],
  from: string,
  to: string,
): void => {
  for (const enumBlock of EnumBlock.filter(blocks)) {
    // change enum name
    if (enumBlock.getEnumName() === from) {
      enumBlock.setEnumName(to);
    }
  }

  for (const modelBlock of ModelBlock.filter(blocks)) {
    // change field type
    const fields = modelBlock.getFieldLines();
    for (const field of fields) {
      const beforeFileType = field.getFieldType();
      if (field.getFieldTypeBaseName() === from) {
        // keep array and nullable
        field.setFieldType(beforeFileType.replace(from, to));
      }
    }
  }
};
