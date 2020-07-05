import { ActionPerform, ActionReducerAction, IPerformResult, IOptions, ISelectorOptions, dataToKeyType } from './types';
import { Dispatch, useEffect } from 'react';

const idFromSelectorOptions = <I, O>(
  selectorOptions: ISelectorOptions<I, O> | undefined,
  dataToKey: dataToKeyType<I>
): string | undefined => {
  if (selectorOptions?.id !== undefined) {
    return selectorOptions.id;
  } else if (selectorOptions?.data !== undefined) {
    return dataToKey(selectorOptions.data);
  } else {
    return dataToKey(undefined);
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

  const hasValue = rootState[options.prefix]?.result && rootState[options.prefix]?.result[id as string];
  const callDispatch = selectorOptions?.invokeAtFirstRun && selectorOptions?.dispatch;

  useEffect(() => {
    if (!hasValue && callDispatch && selectorOptions?.dispatch) {
      perform((selectorOptions?.data as I))(selectorOptions.dispatch as Dispatch<ActionReducerAction<O>>);
    }
  }, [hasValue, callDispatch]);

  if (hasValue) {
    return rootState[options.prefix]?.result[id as string] as IPerformResult<O>;
  } else {
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

export const createSelector = <I, O>(
  perform: ActionPerform<I>,
  options: IOptions<I, O>,
  dataToKey: dataToKeyType<I>,
) =>
  (selectorOptions?: ISelectorOptions<I, O>) => {
    const id = idFromSelectorOptions<I, O>(selectorOptions, dataToKey);
    return (rootState: any): { data: O | undefined, error: any | undefined, inProgress: boolean | undefined } => {
      const res = retrieveStateAndDispatchActionIfNeeded(perform, options, selectorOptions, id, rootState);
      return {
        data: res?.data,
        error: res?.error,
        inProgress: res?.inProgress,
      };
    };
  };
