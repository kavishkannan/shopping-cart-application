export interface IOrder {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  ordered_at: Date;
}

export interface IAdminOrder extends IOrder {
  customer_name: string;
  email: string;
}
