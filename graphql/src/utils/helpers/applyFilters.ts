export type FunctionToFilter<T> = ((item: T) => boolean)

export const applyFilters = <T>(
  items: T[],
  filters: FunctionToFilter<T>[],
  additives: boolean
) => {
  let additiveResult: T[] = [];
  let subtractiveResult: T[] = [];
  filters.forEach((filter, i) => {
    if (additives)
      additiveResult = [...additiveResult, ...items.filter(filter)];
    else
      subtractiveResult = i > 0
        ? subtractiveResult.filter(filter)
        : items.filter(filter);
  });
  return additives ? additiveResult : subtractiveResult;
};
