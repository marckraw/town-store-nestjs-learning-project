import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Product } from './product.interface';
import { NewProductDto } from './dto/new-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  @Get()
  getAll(@Query('name') searchByName: string): readonly Product[] {
    return this.productsService.getAll(searchByName);
  }

  @Get(':productId')
  getOne(@Param('productId', ParseIntPipe) productId: number): Product {
    return this.productsService.getOneById(productId);
  }

  @Post()
  addNewProduct(@Body() payload: NewProductDto): Product {
    return this.productsService.createNew(payload);
  }

  @Patch(':productId')
  updateProduct(
    @Param('productId') productId: number,
    @Body() product: UpdateProductDto,
  ) {
    return this.productsService.update(productId, product);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('productId') productId: number): void {
    return this.productsService.removeById(productId);
  }
}
