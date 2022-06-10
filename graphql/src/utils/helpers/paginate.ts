export const paginateItems = <T>(items: T[], skip?: number, take?: number) =>
  items.slice(skip || 0, (skip || 0) + (take || Infinity));
