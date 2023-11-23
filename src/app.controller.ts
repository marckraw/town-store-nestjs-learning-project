import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { NewCategoryDto } from './new-category.dto';

interface Category {
  id: number;
  name: string;
}

@Controller('categories')
export class AppController {
  private categories: Category[] = [
    { id: 1, name: 'Groceries' },
    { id: 2, name: 'Cosmetics' },
    { id: 3, name: 'Toys' },
    { id: 4, name: 'Dairy' },
    { id: 5, name: 'Fashion' },
    { id: 6, name: 'Electronics' },
    { id: 7, name: 'Games' },
  ];

  private id = 8;

  private findCategory(categoryId: number) {
    const category = this.categories.find((c) => c.id === Number(categoryId));

    if (!category) {
      throw new NotFoundException(`category with id: ${categoryId} not found`);
    }

    return category;
  }

  @Get()
  getAll(): Category[] {
    return this.categories;
  }

  @Get(':id')
  getSingleCategory(@Param('id', ParseIntPipe) categoryId: number): Category {
    return this.findCategory(categoryId);
  }
  @Post()
  addNewCategory(@Body() payload: NewCategoryDto) {
    const newCategory: Category = {
      id: this.id++,
      ...payload,
    };

    this.categories.push(newCategory);

    return payload;
  }

  @Delete(':id')
  removeCategory(@Param('id') categoryId: number) {
    this.findCategory(categoryId);

    const categoryIndex = this.categories.findIndex((c) => c.id === categoryId);

    this.categories.splice(categoryIndex, 1);
  }
}
