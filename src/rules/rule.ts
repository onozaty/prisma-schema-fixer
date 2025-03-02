export type NameTargets = string | string[] | RegExp | undefined;
export type FieldTargets =
  | { model?: NameTargets; field?: NameTargets }
  | { model?: NameTargets; field?: NameTargets }[]
  | undefined;

export const isTargetByName = (targets: NameTargets, name: string): boolean => {
  if (targets === undefined) {
    // default
    return true;
  }

  if (typeof targets === "string") {
    return targets === name;
  }

  if (Array.isArray(targets)) {
    return targets.includes(name);
  }

  return targets.test(name);
};

export const isTargetByField = (
  targets: FieldTargets,
  model: string,
  field: string,
): boolean => {
  if (targets === undefined) {
    // default
    return true;
  }

  if (!Array.isArray(targets)) {
    targets = [targets];
  }

  return targets.some(
    (target) =>
      isTargetByName(target.model, model) &&
      isTargetByName(target.field, field),
  );
};

export const selectConfigByName = <T extends { targets?: NameTargets }>(
  configs: T[],
  name: string,
): T | undefined => {
  return configs
    .slice()
    .reverse()
    .find((config) => isTargetByName(config.targets, name));
};

export const selectConfigByField = <T extends { targets?: FieldTargets }>(
  configs: T[],
  model: string,
  field: string,
): T | undefined => {
  return configs
    .slice()
    .reverse()
    .find((config) => isTargetByField(config.targets, model, field));
};
