import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db";
import { IProduct } from "../interfaces/product.interface";

class ProductRepository {

  async findAll(userId: number, page: number, limit: number, search: string) {
    const Page = Math.max(1, Number(page) || 1);
    const Limit = Math.min(10, Math.max(1, Number(limit) || 10));
    const Offset = (Page - 1) * Limit;

    const SearchValue = `%${search.trim()}%`;

    const [rows] = await pool.execute<RowDataPacket[]>(
      `
      SELECT
        p.id,
        p.name,
        p.description,
        p.category,
        p.price,
        p.stock,
        p.image_url,

        EXISTS (
          SELECT 1
          FROM cart_items ci
          INNER JOIN carts c
            ON c.id = ci.cart_id
          WHERE ci.product_id = p.id
            AND c.user_id = ?
            AND c.status = 'ACTIVE'
        ) AS is_in_cart

      FROM products p

      WHERE p.is_active = 1
        AND (
          p.name LIKE ?
          OR p.description LIKE ?
          OR p.category LIKE ?
        )

      ORDER BY p.id DESC

      LIMIT ${Limit} OFFSET ${Offset}
    `,
      [userId, SearchValue, SearchValue, SearchValue],
    );
  // Limit and Offset already safely converted to integers
    return rows;
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

  async getProductCount(search: string) {
    const searchValue = `%${search.trim()}%`;

    const [rows] = await pool.execute<RowDataPacket[]>(
      `
      SELECT
        COUNT(*) AS total
      FROM products p
      WHERE p.is_active = 1
        AND (
          p.name LIKE ?
          OR p.description LIKE ?
          OR p.category LIKE ?
        )
    `,
      [searchValue, searchValue, searchValue],
    );

    return Number(rows[0].total);
  }
}

export default new ProductRepository();
