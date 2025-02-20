export type Targets = string[] | RegExp;

export const isTarget = (targets: Targets, name: string): boolean => {
  if (Array.isArray(targets)) {
    return targets.includes(name);
  }
  return targets.test(name);
};
