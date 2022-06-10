export const mergeArraysByAttribute = <T, Y>(
  arr1: T[],
  arr2: Y[],
  attr: keyof (T & Y)
) => {
    const r: any = {};
    [...arr1, ...arr2].forEach((e:any) => {r[e[attr]] = { ...r[e[attr]], ...e }  } )
    return Object.values(r) as (T & Y)[];
}
