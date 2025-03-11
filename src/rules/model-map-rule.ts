import { Block } from "../blocks/block";
import { ModelBlock } from "../blocks/model-block";
import {
  Case,
  changeCase,
  changeForm,
  Form,
} from "../transform/string-transform";
import { NameTargets, selectConfigByName } from "./rule";

export namespace ModelMapRule {
  export type Config = {
    targets?: NameTargets;
    case?: Case;
    form?: Form;
    func?: (value: string, target: { name: string }) => string;
  };

  export const apply = (configs: Config[], blocks: Block[]): void => {
    for (const modelBlock of ModelBlock.filter(blocks)) {
      const modelName = modelBlock.getModelName();
      const config = selectConfigByName(configs, modelName);
      if (
        config?.case === undefined &&
        config?.form === undefined &&
        config?.func === undefined
      ) {
        // if no config, skip
        continue;
      }

      let map = modelName;
      if (config.case !== undefined) {
        map = changeCase(map, config.case);
      }
      if (config.form !== undefined) {
        map = changeForm(map, config.form);
      }
      if (config.func !== undefined) {
        map = config.func(map, { name: modelName });
      }

      if (modelName !== map) {
        modelBlock.setMap(map);
      } else {
        // remove map
        modelBlock.setMap(undefined);
      }
    }
  };
}
