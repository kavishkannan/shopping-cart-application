import { RowDataPacket } from "mysql2";
import { pool } from "../config/db";

class OrderRepository {
  async findUserOrders(
    userId: number,
    page: number,
    limit: number,
    search: string,
  ) {
    const offset = (page - 1) * limit;
    const SearchValue = `%${search.trim()}%`;

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
        AND p.name LIKE ?
      ORDER BY c.updated_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `,
      [userId, SearchValue],
    );

    const [countRows] = await pool.execute<RowDataPacket[]>(
      `
        SELECT COUNT(*) AS total
        FROM carts c
        INNER JOIN cart_items ci
          ON ci.cart_id = c.id
        INNER JOIN products p
          ON p.id = ci.product_id
        WHERE c.user_id = ?
          AND c.status = 'ORDER_PLACED'
          AND p.name LIKE ?
      `,
      [userId, SearchValue],
    );

    return {
      rows,
      total: countRows[0].total,
    };
  }

  async findAllOrders(page: number, limit: number, search: string) {
    const offset = (page - 1) * limit;
    const SearchValue = `%${search.trim()}%`;

    const [rows] = await pool.execute<RowDataPacket[]>(
      `
      SELECT
        c.id,
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
        AND (
          p.name LIKE ?
          OR u.name LIKE ?
          OR u.email LIKE ?
        )
      ORDER BY c.updated_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `,
      [SearchValue, SearchValue, SearchValue],
    );

    const [countRows] = await pool.execute<RowDataPacket[]>(
      `
        SELECT COUNT(*) AS total
        FROM carts c
        INNER JOIN cart_items ci
          ON ci.cart_id = c.id
        INNER JOIN products p
          ON p.id = ci.product_id
        INNER JOIN users u
          ON u.id = c.user_id
        WHERE c.status = 'ORDER_PLACED'
          AND (
            p.name LIKE ?
            OR u.name LIKE ?
            OR u.email LIKE ?
          )
      `,
      [SearchValue, SearchValue, SearchValue],
    );

    return {
      rows,
      total: countRows[0].total,
    };
  }
}

export default new OrderRepository();
