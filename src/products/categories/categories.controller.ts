import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { NewCategoryDto } from './dto/new-category.dto';
import { CategoriesService } from './categories.service';
import { CategoryModel } from './category.model';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  getAll(): Promise<readonly CategoryModel[]> {
    return this.categoriesService.getAll();
  }

  @Get(':id')
  getSingleCategory(
    @Param('id', ParseIntPipe) categoryId: number,
  ): Promise<CategoryModel> {
    return this.categoriesService.getOneById(categoryId);
  }
  @Post()
  addNewCategory(@Body() payload: NewCategoryDto): Promise<CategoryModel> {
    return this.categoriesService.createNew(payload);
  }

  @Delete(':id')
  removeCategory(
    @Param('id', ParseIntPipe) categoryId: number,
  ): Promise<number> {
    return this.categoriesService.removeById(categoryId);
  }
}
