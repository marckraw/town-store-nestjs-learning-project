import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { NewCategoryDto } from './dto/new-category.dto';
import { ModelClass } from 'objection';
import { ProductModel } from '../products/product.model';
import { CategoryModel } from './category.model';

@Injectable()
export class CategoriesService {
  private logger = new Logger(CategoriesService.name);

  constructor(
    @Inject('CategoryModel')
    private readonly categoryModel: ModelClass<ProductModel>,
  ) {}

  private async _find(id: number): Promise<CategoryModel> {
    return this.categoryModel
      .query()
      .findById(id)
      .throwIfNotFound(`Category with id: ${id} not found`);
  }

  async getAll(): Promise<readonly CategoryModel[]> {
    return this.categoryModel.query();
  }

  async createNew(categoryDto: NewCategoryDto): Promise<CategoryModel> {
    try {
      return await this.categoryModel.query().insert({
        ...categoryDto,
      });
    } catch (error) {
      this.logger.log(error.constructor.name);
      if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new BadRequestException(
          `Category named "${categoryDto.name}" already exist`,
        );
      }
      throw error;
    }
  }

  getOneById(id: number): Promise<CategoryModel> {
    return this._find(id);
  }

  // TODO: rewrite update to work with database
  public async update(
    id: number,
    partialCategory: any,
  ): Promise<CategoryModel> {
    const category = await this.categoryModel.query().findById(id);

    return category.$query().updateAndFetch(partialCategory);
  }

  async removeById(id: number): Promise<number> {
    await this.getOneById(id);

    return this.categoryModel.query().deleteById(id);
  }
}
