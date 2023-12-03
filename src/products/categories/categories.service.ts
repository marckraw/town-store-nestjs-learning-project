import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Category } from './Category.interface';
import { NewCategoryDto } from './dto/new-category.dto';
import type { Knex } from 'knex';

@Injectable()
export class CategoriesService {
  private logger = new Logger(CategoriesService.name);

  constructor(@Inject('DBConnection') private readonly knex: Knex) {}

  private async find(id: number): Promise<Category> {
    const category = await this.knex<Category>('categories')
      .where({ id })
      .first();
    if (!category) {
      throw new NotFoundException(`category with id: ${id} not found`);
    }
    return category;
  }

  async getAll(): Promise<Category[]> {
    return this.knex<Category>('categories');
  }

  async addNew(categoryDto: NewCategoryDto): Promise<Category> {
    try {
      const [newOne] = await this.knex<Category>('categories').insert({
        ...categoryDto,
      });
      return this.getOneById(newOne);
    } catch (error) {
      if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new BadRequestException(
          `Category named "${categoryDto.name}" already exist`,
        );
      }
      throw error;
    }
  }

  getOneById(id: number): Promise<Category> {
    return this.find(id);
  }

  // TODO: rewrite update to work with database
  public update(id: number, partialCategory: any): Promise<Category> {
    const categoryToUpdate = this.find(id);
    Object.assign(categoryToUpdate, partialCategory);
    return categoryToUpdate;
  }

  async removeById(id: number): Promise<{ id: number; removed: number }> {
    await this.getOneById(id);
    const removed = await this.knex<Category>('categories')
      .where({ id })
      .delete();
    this.logger.log(`Removed category with id: ${id}`);
    return { id, removed };
  }
}
