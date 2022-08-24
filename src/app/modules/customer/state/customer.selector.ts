import { createFeatureSelector, createSelector } from '@ngrx/store';
import { customerState } from './customer.state';

const getCustomerState = createFeatureSelector<customerState>('customer');

export const getCartData = createSelector(getCustomerState, (state) => {
  return state.cartData;
});

export const getBuyNowData = createSelector(getCustomerState,(state)=>{
  return state.buyNowData
})
