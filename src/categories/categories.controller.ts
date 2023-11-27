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
import { Category } from './Category.interface';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  getAll(): readonly Category[] {
    return this.categoriesService.getAll();
  }

  @Get(':id')
  getSingleCategory(@Param('id', ParseIntPipe) categoryId: number): Category {
    return this.categoriesService.getOneById(categoryId);
  }
  @Post()
  addNewCategory(@Body() payload: NewCategoryDto) {
    return this.categoriesService.addNew(payload);
  }

  @Delete(':id')
  removeCategory(@Param('id') categoryId: number) {
    this.categoriesService.removeById(categoryId);
  }
}
