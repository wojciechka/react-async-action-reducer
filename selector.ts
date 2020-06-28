import { ActionPerform, IPerformResult, IOptions, ISelectorOptions, dataToKeyType } from './types';

const idFromSelectorOptions = <I, O>(
  selectorOptions: ISelectorOptions<I, O> | undefined,
  dataToKey: dataToKeyType<I>
): string | undefined => {
  if (selectorOptions?.id !== undefined) {
    return selectorOptions.id;
  } else if (selectorOptions?.data !== undefined) {
    return dataToKey(selectorOptions.data);
  } else {
    return dataToKey();
  }
};

const retrieveStateAndDispatchActionIfNeeded = <I, O>(
  perform: ActionPerform<I>,
  options: IOptions<I, O>,
  selectorOptions: ISelectorOptions<I, O> | undefined,
  id: string | undefined,
  rootState: any,
): IPerformResult<O> | undefined => {
  if (id === undefined) {
    return undefined;
  }

  if (rootState[options.prefix]?.result && rootState[options.prefix]?.result[id as string]) {
    return rootState[options.prefix]?.result[id as string] as IPerformResult<O>;
  } else {
    if (selectorOptions?.invokeAtFirstRun && selectorOptions?.dispatch) {
      perform(selectorOptions?.data)(selectorOptions.dispatch);
    }
    return undefined;
  }
};

export const createResultSelector = <I, O>(
  perform: ActionPerform<I>,
  options: IOptions<I, O>,
  dataToKey: dataToKeyType<I>,
) =>
  (selectorOptions?: ISelectorOptions<I, O>) => {
    const id = idFromSelectorOptions<I, O>(selectorOptions, dataToKey);
    return (rootState: any): IPerformResult<O> | undefined => {
      return retrieveStateAndDispatchActionIfNeeded(perform, options, selectorOptions, id, rootState);
    };
  };

export const createDataSelector = <I, O>(
  perform: ActionPerform<I>,
  options: IOptions<I, O>,
  dataToKey: dataToKeyType<I>,
) =>
  (selectorOptions?: ISelectorOptions<I, O>) => {
    const id = idFromSelectorOptions<I, O>(selectorOptions, dataToKey);
    return (rootState: any): O | undefined => {
      const res = retrieveStateAndDispatchActionIfNeeded(perform, options, selectorOptions, id, rootState);
      return res?.data;
    };
  };

export const createDataAndErrorSelector = <I, O>(
  perform: ActionPerform<I>,
  options: IOptions<I, O>,
  dataToKey: dataToKeyType<I>,
) =>
  (selectorOptions?: ISelectorOptions<I, O>) => {
    const id = idFromSelectorOptions<I, O>(selectorOptions, dataToKey);
    return (rootState: any): { data: O | undefined, error: any | undefined } => {
      const res = retrieveStateAndDispatchActionIfNeeded(perform, options, selectorOptions, id, rootState);
      return {
        data: res?.data,
        error: res?.error,
      };
    };
  };
