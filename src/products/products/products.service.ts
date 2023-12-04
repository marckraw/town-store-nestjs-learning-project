import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { NewProductDto } from './dto/new-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { ModelClass } from 'objection';
import { ProductModel } from './product.model';

@Injectable()
export class ProductsService {
  private logger = new Logger(ProductsService.name);

  constructor(
    @Inject('ProductModel')
    private readonly productModel: ModelClass<ProductModel>,
    private categoriesService: CategoriesService,
  ) {}

  private async _find(productId: number): Promise<ProductModel> {
    return this.productModel
      .query()
      .findById(productId)
      .withGraphFetched('category')
      .throwIfNotFound(`Product with id: ${productId} not found`);
  }

  public async createNew(productDto: NewProductDto): Promise<ProductModel> {
    this.categoriesService.getOneById(productDto.categoryId);

    const newProduct = await this.productModel.query().insert({
      stock: 0,
      ...productDto,
    });

    this.logger.log(`Created new product with id: ${newProduct.id}`);

    return newProduct;
  }

  public async getAll(name: string = ''): Promise<ProductModel[]> {
    return this.productModel.query().whereLike('name', `%${name}%`);
  }

  async checkProductOnStock(id: number, quantity: number) {
    const product = await this._find(id);
    if (product.stock < quantity) {
      throw new BadRequestException(`Product :${id} is out of stock.`);
    }
    return true;
  }

  public getOneById(id: number): Promise<ProductModel> {
    this.logger.verbose(`Read product id: ${id}`);
    this.logger.debug(`Read product id: ${id}`);
    this.logger.log(`Read product id: ${id}`);
    this.logger.warn(`Read product id: ${id}`);
    this.logger.error(`Read product id: ${id}`);
    this.logger.fatal(`Read product id: ${id}`);

    return this._find(id);
  }

  async update(id: number, partialProduct: UpdateProductDto) {
    // rozwiązane zadanie 6.9
    if (partialProduct.categoryId) {
      await this.categoriesService.getOneById(partialProduct.categoryId);
    }
    const product = await this.productModel.query().findById(id);

    return product.$query().updateAndFetch(partialProduct);
  }

  public async removeById(id: number): Promise<number> {
    this._find(id);

    return this.productModel.query().deleteById(id);
  }
}
