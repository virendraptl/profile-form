export interface customerState {
  cartData: Product[];
  buyNowData: Product
}

export const initialState: customerState = {
  cartData: [],
  buyNowData: null
};

export interface Product {
  price: number;
  _id: string;
  _org: {
    _id: string;
    name: string;
    email: string;
  };
  name: string;
  description: string;
  images: { public_id: string; url: string }[];
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  cartCount: number;
}
