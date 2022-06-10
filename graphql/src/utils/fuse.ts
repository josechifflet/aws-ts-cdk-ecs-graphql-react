import Fuse from 'fuse.js';

const FUSE_OPTIONS: Fuse.IFuseOptions<any> = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  minMatchCharLength: 1,
}

export function searchItems<T>(items: T[], filterInput?: string, keys?: string[], options = FUSE_OPTIONS) {
  if (filterInput) {
      const fuse = new Fuse<T>(items, {...options, keys});
      return fuse.search(filterInput).map(fr => fr.item);
  } return items;
}