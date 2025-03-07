import { Block } from "../blocks/block";
import { EnumBlock } from "../blocks/enum-block";
import { ModelBlock, PRIMITIVE_TYPES } from "../blocks/model-block";
import { Case, changeCase } from "../transform/string-transform";
import { FieldTargets, selectConfigByField } from "./rule";

export namespace FieldMapRule {
  export type Config = {
    targets?: FieldTargets;
    case?: Case;
  };

  export const apply = (configs: Config[], blocks: Block[]): void => {
    const enumNames = EnumBlock.filter(blocks).map((block) =>
      block.getEnumName(),
    );

    for (const modelBlock of ModelBlock.filter(blocks)) {
      const modelName = modelBlock.getModelName();
      const fields = modelBlock.getFieldLines();

      for (const field of fields) {
        const trimedFieldType = field.getTrimedFieldType();
        if (
          PRIMITIVE_TYPES.includes(trimedFieldType) ||
          enumNames.includes(trimedFieldType)
        ) {
          const fieldName = field.getFieldName();
          const config = selectConfigByField(configs, modelName, fieldName);
          if (config === undefined) {
            continue;
          }

          let map = fieldName;
          if (config.case !== undefined) {
            map = changeCase(map, config.case);
          }

          if (fieldName !== map) {
            field.setMap(map);
          } else {
            // remove map
            field.setMap(undefined);
          }
        }
      }
    }
  };
}
