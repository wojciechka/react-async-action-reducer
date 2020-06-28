import { Dispatch } from 'react';

import { IFailureActionPayload, IOptions, IStartedActionPayload, ISuccessActionPayload, IClearActionPayload, IClearOtherData, ActionReducerAction } from './types';

type performActionsType<I, O> = (dispatch: Dispatch<ActionReducerAction<O>>, id: string, data?: I) => Promise<void>;

export const createPerformActions = <I, O>(options: IOptions<I, O>): performActionsType<I, O> => {
  const actions = {
    started: (id: string, reqId: string): IStartedActionPayload => ({ type: `${options.prefix}.started`, id, reqId }),
    failure: (id: string, reqId: string, error: Error): IFailureActionPayload => ({ type: `${options.prefix}.failure`, id, reqId, payload: error }),
    success: (id: string, reqId: string, payload: O): ISuccessActionPayload<O> => ({ type: `${options.prefix}.success`, id, reqId, payload }),
  };

  return async (dispatch: Dispatch<ActionReducerAction<O>>, id: string, data?: I) => {
    const reqId = `${new Date().getTime()}${Math.floor(Math.random() * 9000000) + 1000000}`;
    try {
      dispatch(actions.started(id, reqId));
      const result = await options.perform(data);
      dispatch(actions.success(id, reqId, result));
      try {
        if (options.clearOtherData) {
          for (const otherData of options.clearOtherData) {
            let action: IClearActionPayload | undefined;
            if ((otherData as IClearOtherData).type !== undefined) {
              action = {
                type: `${(otherData as IClearOtherData).type}.clear`,
                otherData: otherData as IClearOtherData,
              };
            } else {
              action = {
                type: `${otherData}.clear`,
              };
            }
            if (action !== undefined) {
              dispatch(action as IClearActionPayload);
            }
          }
        }
      } catch (e) {
        console.error('unable to clear other data', e);
      }
    } catch (e) {
      dispatch(actions.failure(id, reqId, e));
    }
  };
};
