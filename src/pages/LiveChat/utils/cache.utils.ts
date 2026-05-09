export const CACHE_DURATION = 1000 * 30;

export const MAX_CACHE_SIZE = 10;

export type TCacheItem<T> = {
  data: T;
  fetchedAt: number;
};

export type TCacheMap<T> = Record<string, TCacheItem<T>>;

export const createCacheKey = (value: unknown) => {
  return JSON.stringify(value);
};

export const isCacheValid = (fetchedAt: number, duration = CACHE_DURATION) => {
  return Date.now() - fetchedAt < duration;
};

export const maintainCacheLimit = <T>(
  cache: TCacheMap<T>,
  maxSize = MAX_CACHE_SIZE,
) => {
  const cacheKeys = Object.keys(cache);

  if (cacheKeys.length <= maxSize) {
    return cache;
  }

  const oldestKey = cacheKeys[0];
  delete cache[oldestKey];
  return cache;
};

export const getCache = <T>(cache: TCacheMap<T>, key: string) => {
  return cache[key];
};

export const setCache = <T>({
  cache,
  key,
  data,
}: {
  cache: TCacheMap<T>;
  key: string;
  data: T;
}) => {
  const updatedCache = {
    ...cache,
    [key]: {
      data,
      fetchedAt: Date.now(),
    },
  };

  return maintainCacheLimit(updatedCache);
};
