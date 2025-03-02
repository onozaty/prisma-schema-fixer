import { Block } from "../block";
import { changeFieldName } from "../transform/block-transform";
import { Case, changeCase } from "../transform/string-transform";
import { FieldTargets, selectConfigByField } from "./rule";

export namespace FieldNameRule {
  export type Config = {
    targets?: FieldTargets;
    case?: Case;
  };

  export const apply = (configs: Config[], block: Block): void => {
    if (block.type !== "model") {
      return;
    }

    changeFieldName(block, (model: string, beforeName: string) => {
      const config = selectConfigByField(configs, model, beforeName);
      if (config === undefined) {
        return undefined;
      }

      let afterName = beforeName;
      if (config.case !== undefined) {
        afterName = changeCase(afterName, config.case);
      }
      return afterName;
    });
  };
}
