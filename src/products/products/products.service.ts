import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './product.interface';
import { NewProductDto } from './dto/new-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { Knex } from 'knex';

@Injectable()
export class ProductsService {
  private logger = new Logger(ProductsService.name);

  constructor(
    @Inject('DBConnection') private readonly knex: Knex,
    private categoriesService: CategoriesService,
  ) {}

  private async _find(productId: number): Promise<Product> {
    const product = await this.knex<Product>('products')
      .where({ id: productId })
      .first();
    if (!product) {
      throw new NotFoundException(`Product with id: ${productId} not found`);
    }
    return product;
  }

  public async createNew(productDto: NewProductDto): Promise<Product> {
    this.categoriesService.getOneById(productDto.categoryId);

    try {
      const [newOne] = await this.knex<Product>('products').insert({
        ...productDto,
      });

      return this.getOneById(newOne);
    } catch (error) {
      if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new BadRequestException(
          `Product named "${productDto.name}" already exist`,
        );
      }

      throw error;
    }
  }

  public async getAll(name: string = ''): Promise<Product[]> {
    const allProduct = await this.knex<Product>('products');

    return allProduct.filter((p) =>
      p.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  public getOneById(id: number): Promise<Product> {
    this.logger.verbose(`Read product id: ${id}`);
    this.logger.debug(`Read product id: ${id}`);
    this.logger.log(`Read product id: ${id}`);
    this.logger.warn(`Read product id: ${id}`);
    this.logger.error(`Read product id: ${id}`);
    this.logger.fatal(`Read product id: ${id}`);

    return this._find(id);
  }

  public update(id: number, partialProduct: UpdateProductDto) {
    const productToUpdate = this._find(id);
    Object.assign(productToUpdate, partialProduct);
    return productToUpdate;
  }

  public async removeById(
    id: number,
  ): Promise<{ id: number; removed: number }> {
    this._find(id);

    const removed = await this.knex<Product>('products').where({ id }).delete();
    this.logger.log(`Removed product with id: ${id}`);

    return { id, removed };
  }
}
