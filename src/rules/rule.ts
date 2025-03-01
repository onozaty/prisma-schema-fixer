export type Targets = string[] | RegExp | undefined;

export const isTarget = (targets: Targets, name: string): boolean => {
  if (targets === undefined) {
    // default
    return true;
  }

  if (Array.isArray(targets)) {
    return targets.includes(name);
  }
  return targets.test(name);
};

export const selectConfigByName = <T extends { targets?: Targets }>(
  configs: T[],
  name: string,
): T | undefined => {
  return configs
    .slice()
    .reverse()
    .find((config) => isTarget(config.targets, name));
};
