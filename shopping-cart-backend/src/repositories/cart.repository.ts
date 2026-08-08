import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/db";
import { ICartItem } from "../interfaces/cart.interface";

class CartRepository {
  async findActiveCart(userId: number) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `
            SELECT
                id,
                user_id,
                status
            FROM carts
            WHERE user_id = ?
              AND status = 'ACTIVE'
            LIMIT 1
            `,
      [userId],
    );

    return rows.length ? rows[0] : null;
  }

  async createCart(userId: number): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
      `
            INSERT INTO carts
            (
                user_id,
                status
            )
            VALUES (?, 'ACTIVE')
            `,
      [userId],
    );

    return result.insertId;
  }

  async findCartItem(cartId: number, productId: number) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `
            SELECT
                id,
                cart_id,
                product_id,
                quantity,
                unit_price,
                total_price
            FROM cart_items
            WHERE cart_id = ?
              AND product_id = ?
            LIMIT 1
            `,
      [cartId, productId],
    );

    return rows.length ? rows[0] : null;
  }

  async findCartItemById(id: number) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `
            SELECT
                ci.id,
                ci.cart_id,
                ci.product_id,
                ci.quantity,
                ci.unit_price,
                ci.total_price,
                p.stock
            FROM cart_items ci
            INNER JOIN products p
                ON p.id = ci.product_id
            WHERE ci.id = ?
            LIMIT 1
            `,
      [id],
    );

    return rows.length ? rows[0] : null;
  }

  async addCartItem(item: ICartItem): Promise<void> {
    await pool.execute<ResultSetHeader>(
      `
            INSERT INTO cart_items
            (
                cart_id,
                product_id,
                quantity,
                unit_price,
                total_price
            )
            VALUES (?, ?, ?, ?, ?)
            `,
      [
        item.cart_id,
        item.product_id,
        item.quantity,
        item.unit_price,
        item.total_price,
      ],
    );
  }

  async updateQuantity(
    id: number,
    quantity: number,
    totalPrice: number,
  ): Promise<void> {
    await pool.execute<ResultSetHeader>(
      `
            UPDATE cart_items
            SET
                quantity = ?,
                total_price = ?
            WHERE id = ?
            `,
      [quantity, totalPrice, id],
    );
  }

  async getCart(cartId: number) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `
            SELECT
                ci.id,
                ci.product_id,
                p.name,
                p.category,
                p.image_url,
                ci.quantity,
                ci.unit_price,
                ci.total_price
            FROM cart_items ci
            INNER JOIN products p
                ON p.id = ci.product_id
            WHERE ci.cart_id = ?
            ORDER BY ci.created_at DESC
            `,
      [cartId],
    );

    return rows;
  }

  async removeItem(id: number): Promise<void> {
    await pool.execute<ResultSetHeader>(
      `
            DELETE FROM cart_items
            WHERE id = ?
            `,
      [id],
    );
  }

  async reduceStock(cartId: number): Promise<void> {
    await pool.execute(
      `
        UPDATE products p
        INNER JOIN cart_items ci
            ON p.id = ci.product_id
        SET
            p.stock = p.stock - ci.quantity
        WHERE
            ci.cart_id = ?
        `,
      [cartId],
    );
  }

  async placeOrder(cartId: number): Promise<void> {
    await pool.execute<ResultSetHeader>(
      `
            UPDATE carts
            SET
                status = 'ORDER_PLACED'
            WHERE id = ?
            `,
      [cartId],
    );
  }

  async removeItemByProduct(userId: number, productId: number) {
    await pool.execute(
      `DELETE ci
      FROM cart_items ci
      INNER JOIN carts c
        ON c.id = ci.cart_id
      WHERE c.user_id = ?
        AND c.status = 'ACTIVE'
        AND ci.product_id = ?
    `,
      [userId, productId],
    );
  }
}

export default new CartRepository();
