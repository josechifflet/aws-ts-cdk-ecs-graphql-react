import _ from "lodash";
import { EntityTarget, getRepository } from "typeorm";

export const getFromCache = async <T>(entity: EntityTarget<T>) => {
  const repo = getRepository(entity);
  return repo.find();
};

export const updateCache = async <T>(
  entity: EntityTarget<T>,
  getObjects: () => Promise<T[]>,
  current?: T[]
) => {
  const repo = getRepository(entity);
  const remoteObjects = await getObjects();
  const currentObjects = current ? current : await repo.find();
  const objects = remoteObjects.map((t1: any) => ({
    ...t1,
    ...currentObjects.find((t2: any) => t2.id === t1.id),
  }));
  const chunks = _.chunk(objects, 100);
  let result: T[] = [];
  for (let chunk of chunks) {
    result = result.concat(await repo.save(chunk));
  }
  return result;
};
