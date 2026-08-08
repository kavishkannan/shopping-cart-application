import OrderRepository from "../repositories/order.repository";

class OrderService {
  async getUserOrders(
    userId: number,
    page: number,
    limit: number,
    search: string,
  ) {
    return await OrderRepository.findUserOrders(userId, page, limit, search);
  }

  async getAllOrders(page: number, limit: number, search: string) {
    return await OrderRepository.findAllOrders(page, limit, search);
  }
}

export default new OrderService();
