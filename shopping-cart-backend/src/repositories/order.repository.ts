import { RowDataPacket } from "mysql2";
import { pool } from "../config/db";

class OrderRepository {
  async getOrdersByUser(userId: number) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `
      SELECT
        ci.product_id,
        p.name AS product_name,
        ci.quantity,
        ci.unit_price,
        ci.total_price,
        DATE(c.updated_at) AS order_date
      FROM carts c
      INNER JOIN cart_items ci
        ON ci.cart_id = c.id
      INNER JOIN products p
        ON p.id = ci.product_id
      WHERE c.user_id = ?
        AND c.status = 'ORDER_PLACED'
      ORDER BY c.updated_at DESC
    `,
      [userId],
    );

    return rows;
  }

  async getAllOrders() {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `
      SELECT
        ci.product_id,
        p.name AS product_name,
        ci.quantity,
        ci.unit_price,
        ci.total_price,
        DATE(c.updated_at) AS order_date,
        u.name AS customer_name,
        u.email
      FROM carts c
      INNER JOIN cart_items ci
        ON ci.cart_id = c.id
      INNER JOIN products p
        ON p.id = ci.product_id
      INNER JOIN users u
        ON u.id = c.user_id
      WHERE c.status = 'ORDER_PLACED'
      ORDER BY c.updated_at DESC
    `,
    );

    return rows;
  }
}

export default new OrderRepository();
