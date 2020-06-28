import { dataToKeyType, IOptions } from './types';

export const createDataToKey = <I, O>(options: IOptions<I, O>): dataToKeyType<I> => {
  if (options.dataToKey) {
    return options.dataToKey;
  } else if (options.dataIsKey) {
    return (data?: I) => {
      return (data && (data as any).toString()) || 'item';
    };
  } else if (options.idField) {
    return (data?: I) => {
      if (data && (data as any)[options.idField as string]) {
        return (data as any)[options.idField as string].toString();
      } else {
        return options.idValue || 'item';
      }
    };
  } else {
    return () => options.idValue || 'item';
  }
};
