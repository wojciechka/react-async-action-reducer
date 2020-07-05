import { Dispatch } from 'react';

export interface IClearOtherData {
  type: string;
}
export type ClearOtherData = string | IClearOtherData;

// inputs that specify how an action should be defined
export interface IOptions<I, O> {
  // prefix to use for actions
  prefix: string;

  // callback to run when action is to be performed
  perform: (data?: I) => Promise<O>;

  // other actions and reducers to clear data for once the command was performed
  clearOtherData?: ClearOtherData[];

  // if specified, this maps the data passed to the action and returns the key in which the result should be stored
  dataToKey?: (data?: I) => string;

  // if set to truthy value, data passed to the action is used as identifier for storing the result
  dataIsKey?: boolean;

  // if specified, retrieve key for storing in redux state from specific field in the data input
  idField?: string;

  // if specified, use this as the name of the key in state
  idValue?: string;

  // if neither of the above were specified, the 'item' key is used for storing data by default
}

// ISelectorOptions specifies otpions to pass to selector
export interface ISelectorOptions<I, O> {
  id?: string;
  data?: I;
  invokeAtFirstRun?: boolean;
  dispatch?: Dispatch<ActionReducerAction<O>>;
};

// IPerformResult describes the state of an action, including whether in progress and/or if error has occurred
export interface IPerformResult<O> {
  reqId: string;
  inProgress: boolean;
  data: O | undefined;
  error: Error | undefined;
}

export interface IState<O> {
  result: { [id: string]: IPerformResult<O> };
}

export interface IStartedActionPayload {
  type: string;
  id: string;
  reqId: string;
}

export interface IFailureActionPayload {
  type: string;
  id: string;
  reqId: string;
  payload: Error;
}

export interface ISuccessActionPayload<O> {
  type: string;
  id: string;
  reqId: string;
  payload: O;
}

export interface IClearActionPayload {
  type: string;
  otherData?: ClearOtherData;
}

export type ActionReducerAction<O> = IStartedActionPayload | IFailureActionPayload | ISuccessActionPayload<O> | IClearActionPayload;

export type ReducerFunction<O> = (state: IState<O>, action: ActionReducerAction<O>) => IState<O>;

export type ActionPerform<I> = (data: I) => (dispatch: Dispatch<ActionReducerAction<any>>) => string;

// dataToKey can be called without data in some cases, hence data parameter has to be made optional
export type dataToKeyType<I> = (data?: I) => string;

export interface IActionAndReducerData<I, O> {
  reducerFunction: ReducerFunction<O>;
  reducer: { [id: string]: ReducerFunction<O> };
  dataToKey: dataToKeyType<I>;
  perform: ActionPerform<I>;
  prefix: string;
  resultSelector: (selectorOptions?: ISelectorOptions<I, O>) => (state: any) => IPerformResult<O> | undefined;
  dataSelector: (selectorOptions?: ISelectorOptions<I, O>) => (state: any) => O | undefined;
  selector: (selectorOptions?: ISelectorOptions<I, O>) => (state: any) => { data: O | undefined, error: any | undefined, inProgress: boolean | undefined };
  // the selector below is now deprecated
  dataAndErrorSelector: (selectorOptions?: ISelectorOptions<I, O>) => (state: any) => { data: O | undefined, error: any | undefined };
}

export type ActionAndReducer<I, O> = ActionPerform<I> & IActionAndReducerData<I, O>;
