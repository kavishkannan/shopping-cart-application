export interface IProduct {
  id?: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image_url: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
