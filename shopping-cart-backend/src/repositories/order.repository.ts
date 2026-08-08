import { RowDataPacket } from "mysql2";
import { pool } from "../config/db";

class OrderRepository {
  async getOrdersByUser(userId: number) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `
            SELECT
                p.id AS product_id,
                p.name AS product_name,
                ci.quantity,
                ci.unit_price,
                ci.total_price,
                c.updated_at AS ordered_at
            FROM carts c
            INNER JOIN cart_items ci
                ON ci.cart_id = c.id
            INNER JOIN products p
                ON p.id = ci.product_id
            WHERE
                c.user_id = ?
                AND c.status = 'ORDER_PLACED'
            ORDER BY
                c.updated_at DESC
            `,
      [userId],
    );

    return rows;
  }

  async getAllOrders() {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `
            SELECT
                u.name AS customer_name,
                u.email,
                p.id AS product_id,
                p.name AS product_name,
                ci.quantity,
                ci.unit_price,
                ci.total_price,
                c.updated_at AS ordered_at
            FROM carts c
            INNER JOIN users u
                ON u.id = c.user_id
            INNER JOIN cart_items ci
                ON ci.cart_id = c.id
            INNER JOIN products p
                ON p.id = ci.product_id
            WHERE
                c.status = 'ORDER_PLACED'
            ORDER BY
                c.updated_at DESC
            `,
    );

    return rows;
  }
}

export default new OrderRepository();
