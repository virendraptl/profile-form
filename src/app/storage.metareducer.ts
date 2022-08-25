import { ActionReducer, INIT } from '@ngrx/store';
import { customerState } from './modules/customer/state/customer.state';
// import { customerState } from '..';

export const hydrationMetaReducer = (
  reducer: ActionReducer<customerState>
): ActionReducer<customerState> => {
  return (state, action) => {
    if (action.type === INIT) {
      const storageValue = localStorage.getItem('state');
      if (storageValue) {
        try {
          return JSON.parse(storageValue);
        } catch {
          localStorage.removeItem('state');
        }
      }
    }
    const nextState = reducer(state, action);
    localStorage.setItem('state', JSON.stringify(nextState));
    return nextState;
  };
};
