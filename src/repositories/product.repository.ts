import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db";
import { IProduct } from "../interfaces/product.interface";

class ProductRepository {
  async findAll(): Promise<IProduct[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(`
            SELECT
                id,
                name,
                description,
                category,
                price,
                stock,
                image_url
            FROM products
            WHERE is_active = TRUE
            ORDER BY created_at DESC
        `);

    return rows as IProduct[];
  }

  async findById(id: number): Promise<IProduct | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `
            SELECT
                id,
                name,
                description,
                category,
                price,
                stock,
                image_url
            FROM products
            WHERE id = ?
            AND is_active = TRUE
            LIMIT 1
        `,
      [id],
    );

    return rows.length ? (rows[0] as IProduct) : null;
  }

  async create(product: IProduct): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      `
            INSERT INTO products
            (
                name,
                description,
                category,
                price,
                stock,
                image_url
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `,
      [
        product.name,
        product.description,
        product.category,
        product.price,
        product.stock,
        product.image_url,
      ],
    );

    return result.insertId;
  }

  async update(id: number, product: IProduct): Promise<void> {
    await pool.execute(
      `
            UPDATE products
            SET
                name = ?,
                description = ?,
                category = ?,
                price = ?,
                stock = ?,
                image_url = ?
            WHERE id = ?
            AND is_active = TRUE;
        `,
      [
        product.name,
        product.description,
        product.category,
        product.price,
        product.stock,
        product.image_url,
        id,
      ],
    );
  }

  async delete(id: number): Promise<void> {
    await pool.execute(
      `
        UPDATE products
        SET
            is_active = FALSE
        WHERE id = ?
        AND is_active = TRUE;
        `,
      [id],
    );
  }
  async findProductForCart(id: number): Promise<IProduct | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `
        SELECT
            id,
            name,
            price,
            stock,
            is_active
        FROM products
        WHERE id = ?
        AND is_active = TRUE
        LIMIT 1
    `,
      [id],
    );

    return rows.length ? (rows[0] as IProduct) : null;
  }
}

export default new ProductRepository();
