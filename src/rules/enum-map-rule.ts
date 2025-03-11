import { Block } from "../blocks/block";
import { EnumBlock } from "../blocks/enum-block";
import {
  Case,
  changeCase,
  changeForm,
  Form,
} from "../transform/string-transform";
import { NameTargets, selectConfigByName } from "./rule";

export namespace EnumMapRule {
  export type Config = {
    targets?: NameTargets;
    case?: Case;
    form?: Form;
    func?: (value: string, target: { name: string }) => string;
  };

  export const apply = (configs: Config[], blocks: Block[]): void => {
    for (const enumBlock of EnumBlock.filter(blocks)) {
      const enumName = enumBlock.getEnumName();
      const config = selectConfigByName(configs, enumName);
      if (
        config?.case === undefined &&
        config?.form === undefined &&
        config?.func === undefined
      ) {
        // if no config, skip
        continue;
      }

      let map = enumName;
      if (config.case !== undefined) {
        map = changeCase(map, config.case);
      }
      if (config.form !== undefined) {
        map = changeForm(map, config.form);
      }
      if (config.func !== undefined) {
        map = config.func(map, { name: enumName });
      }

      if (enumName !== map) {
        enumBlock.setMap(map);
      } else {
        // remove map
        enumBlock.setMap(undefined);
      }
    }
  };
}
