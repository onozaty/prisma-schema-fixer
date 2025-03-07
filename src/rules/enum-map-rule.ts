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
  };

  export const apply = (configs: Config[], blocks: Block[]): void => {
    for (const enumBlock of EnumBlock.filter(blocks)) {
      const enumName = enumBlock.getEnumName();
      const config = selectConfigByName(configs, enumName);
      if (config === undefined) {
        continue;
      }

      let map = enumName;
      if (config.case !== undefined) {
        map = changeCase(map, config.case);
      }
      if (config.form !== undefined) {
        map = changeForm(map, config.form);
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
