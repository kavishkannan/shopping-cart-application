import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db";
import { IUser } from "../interfaces/user.interface";

class AuthRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    return rows.length ? (rows[0] as IUser) : null;
  }

  async create(user: IUser): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO users
      (name,email,phone,password,role)
      VALUES(?,?,?,?,?)`,
      [user.name, user.email, user.phone, user.password, user.role],
    );

    return result.insertId;
  }
}

export default new AuthRepository();
