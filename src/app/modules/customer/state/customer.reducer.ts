import { createReducer, on } from '@ngrx/store';
import { setBuyNowProduct, updateCart } from './customer.actions';
import { initialState } from './customer.state';

const _customerReducer = createReducer(
  initialState,
  on(updateCart, (state, action) => {
    let updatedCart = [...(action.value || [])];
    // updatedCart.push(action.value);

    return {
      ...state,
      cartData: [...(updatedCart || [])],
    };
  }),
  on(setBuyNowProduct, (state, action) => {
    // let updatedCart = [...(action.value || [])];
    // updatedCart.push(action.value);

    return {
      ...state,
      buyNowData: {...action.value}
    };
  })
);

export function customerReducer(state, action) {
  return _customerReducer(state, action);
}
