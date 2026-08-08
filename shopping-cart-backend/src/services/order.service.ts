import OrderRepository from "../repositories/order.repository";

class OrderService {
  async getOrders(userId: number) {
    const orders = await OrderRepository.getOrdersByUser(userId);

    return orders;
  }

  async getAllOrders() {
    const orders = await OrderRepository.getAllOrders();

    return orders;
  }
}

export default new OrderService();
