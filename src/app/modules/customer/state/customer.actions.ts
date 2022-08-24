import { createAction, props } from '@ngrx/store';
import { Product } from './customer.state';

export const updateCart = createAction(
  'update cart',
  props<{ value: Product[] }>()
);

export const setBuyNowProduct = createAction(
  'set buy now',
  props<{ value: Product }>()
);
