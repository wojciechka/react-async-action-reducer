import { IFailureActionPayload, IState, IOptions, IStartedActionPayload, ISuccessActionPayload, ActionReducerAction, ReducerFunction } from './types';

export const createReducerFunction = <I, O>(options: IOptions<I, O>): ReducerFunction<O> => {
  return (state: IState<O> = { result: {} }, action: ActionReducerAction<O>): IState<O> => {
    switch (action.type) {
      case `${options.prefix}.started`:
      {
        const { id, reqId } = action as IStartedActionPayload;
        state = {
          ...state,
          result: {
            ...state.result,
            [id]: {
              ...state.result[id],
              reqId,
              inProgress: true,
            }
          }
        };
        break;
      }
      case `${options.prefix}.failure`:
      {
        const { id, reqId, payload } = action as IFailureActionPayload;
        if (state.result[id] && state.result[id].reqId === reqId) {
          state = {
            ...state,
            result: {
              ...state.result,
              [id]: {
                ...state.result[id],
                reqId,
                error: payload,
                data: undefined,
                inProgress: false,
              }
            }
          };
        }
        break;
      }
      case `${options.prefix}.success`:
      {
        const { id, reqId, payload } = action as ISuccessActionPayload<O>;
        if (state.result[id] && state.result[id].reqId === reqId) {
          state = {
            ...state,
            result: {
              ...state.result,
              [id]: {
                ...state.result[id],
                reqId,
                error: undefined,
                data: payload,
                inProgress: false,
              }
            }
          };
        }
        break;
      }
      case `${options.prefix}.clear`:
      {
        state = {
          ...state,
          result: {},
        };
        break;
      }
    }
    return state;
  };
}
