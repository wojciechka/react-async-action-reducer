import { Dispatch } from 'react';

import { ActionAndReducer, ActionPerform, IOptions, ActionReducerAction } from './types';
import { createPerformActions } from './actions';
import { createDataToKey } from './dataToKey';
import { createReducerFunction } from './reducer';
import { createDataAndErrorSelector, createDataSelector, createResultSelector } from './selector'

export * from './types';

export const createActionAndReducer = <I, O>(options: IOptions<I, O>): ActionAndReducer<I, O> => {
  const performActions = createPerformActions(options);
  let dataToKey = createDataToKey(options);
  const reducerFunction = createReducerFunction(options);

  const perform: ActionPerform<I> = (data?: I) => {
    return (dispatch: Dispatch<ActionReducerAction<O>>): string => {
      const id = dataToKey(data);
      performActions(dispatch, id, data);
      return id;
    };
  };

  const resultSelector = createResultSelector(perform, options, dataToKey);
  const dataSelector = createDataSelector(perform, options, dataToKey);
  const dataAndErrorSelector = createDataAndErrorSelector(perform, options, dataToKey);

  return Object.assign(perform, {
    perform,
    reducer: { [options.prefix]: reducerFunction },
    reducerFunction,
    dataToKey,
    resultSelector,
    dataSelector,
    dataAndErrorSelector,
    prefix: options.prefix
  });
};
