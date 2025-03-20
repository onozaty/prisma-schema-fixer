import { Block } from "../blocks/block";
import { ModelBlock } from "../blocks/model-block";
import { FieldTargets, selectConfigByField } from "./rule";

export namespace FieldAttributeRule {
  export type TypeToAttributes = {
    [key: string]: string[];
  };

  export type Config = {
    targets?: FieldTargets;
    typeToAttributes?: TypeToAttributes;
  };

  export const apply = (configs: Config[], blocks: Block[]): void => {
    for (const modelBlock of ModelBlock.filter(blocks)) {
      const modelName = modelBlock.getModelName();
      const fields = modelBlock.getFieldLines();

      for (const field of fields) {
        const fieldName = field.getFieldName();
        const config = selectConfigByField(configs, modelName, fieldName);
        if (config?.typeToAttributes === undefined) {
          // if no config, skip
          continue;
        }

        const attributes =
          config.typeToAttributes[field.getFieldTypeNonNullable()];
        attributes?.map((attribute) =>
          field.addAttributeIfNotExists(attribute),
        );
      }
    }
  };
}
