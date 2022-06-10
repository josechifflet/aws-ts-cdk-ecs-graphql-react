export const isIterable = (obj: any) => {
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}


export const isSpliteable = (obj: any) => typeof obj === 'string';