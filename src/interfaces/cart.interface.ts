export interface ICart {
  id?: number;
  user_id: number;
  status: "ACTIVE" | "ORDER_PLACED";
  created_at?: Date;
  updated_at?: Date;
}

export interface ICartItem {
  id?: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ICartDetails {
  id: number;
  user_id: number;
  status: "ACTIVE" | "ORDER_PLACED";
}

export interface ICartItemDetails {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  stock: number;
}
