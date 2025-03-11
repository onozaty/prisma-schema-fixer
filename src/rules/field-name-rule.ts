import { Block } from "../blocks/block";
import { ModelBlock } from "../blocks/model-block";
import { changeFieldName } from "../transform/block-transform";
import { Case, changeCase } from "../transform/string-transform";
import { FieldTargets, selectConfigByField } from "./rule";

export namespace FieldNameRule {
  export type Config = {
    targets?: FieldTargets;
    case?: Case;
    func?: (
      value: string,
      target: { model: string; field: string; type: string },
    ) => string;
  };

  export const apply = (configs: Config[], blocks: Block[]): void => {
    for (const modelBlock of ModelBlock.filter(blocks)) {
      const modelName = modelBlock.getModelName();
      const fields = modelBlock.getFieldLines();

      for (const field of fields) {
        const fieldName = field.getFieldName();
        const config = selectConfigByField(configs, modelName, fieldName);
        if (config?.case === undefined && config?.func === undefined) {
          // if no config, skip
          continue;
        }

        let changedFieldName = fieldName;
        if (config.case !== undefined) {
          changedFieldName = changeCase(changedFieldName, config.case);
        }
        if (config.func !== undefined) {
          changedFieldName = config.func(changedFieldName, {
            model: modelName,
            field: fieldName,
            type: field.getFieldType(),
          });
        }

        if (fieldName !== changedFieldName) {
          changeFieldName(blocks, modelName, fieldName, changedFieldName);
        }
      }
    }
  };
}
