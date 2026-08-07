import ProductRepository from "../repositories/product.repository";
import { IProduct } from "../interfaces/product.interface";
import { STATUS_CODES } from "../constants/statusCodes";

class ProductService {
  async getProducts() {
    return await ProductRepository.findAll();
  }

  async getProductById(id: number) {
    const product = await ProductRepository.findById(id);

    if (!product) {
      throw {
        statusCode: STATUS_CODES.UNPROCCESSABLE_CONTENT,
        message: "Product not found",
      };
    }

    return product;
  }

  async createProduct(product: IProduct) {
    const productId = await ProductRepository.create(product);

    return {
      id: productId,
      ...product,
    };
  }

  async updateProduct(id: number, product: IProduct) {
    const existingProduct = await ProductRepository.findById(id);

    if (!existingProduct) {
      throw {
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "Product not found",
      };
    }

    await ProductRepository.update(id, product);
  }

  async deleteProduct(id: number) {
    const existingProduct = await ProductRepository.findById(id);

    if (!existingProduct) {
      throw {
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "Product not found",
      };
    }

    await ProductRepository.delete(id);
  }
}

export default new ProductService();
