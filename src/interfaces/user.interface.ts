export interface IUser {
  id?: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "ADMIN" | "CUSTOMER";
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IJwtPayload {
  id: number;
  email: string;
  role: string;
}
