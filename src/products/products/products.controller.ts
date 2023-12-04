import {
  BadRequestException,
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
  UseGuards,
} from '@nestjs/common';
import * as fsp from 'node:fs/promises';
import { NewProductDto } from './dto/new-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { ClientLanguage } from '../../middlewares/client-language.decorator';
import { ApiKeyGuard } from '../../guards/api-key.guard';
import { SupportedLanguages } from '../../shared/language/language.service';
import { ProductModel } from './product.model';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get('test-file')
  async getAllFromFile() {
    const fileData = await fsp.readFile('not-existing-file.txt');
    return { fileData };
  }

  @Get('sample-error')
  async getSampleError(@ClientLanguage() language: SupportedLanguages) {
    throw new BadRequestException(
      language === 'pl'
        ? 'Błąd z przykładową wiadomością'
        : 'Error with sample message',
    );
  }
  @Get()
  getAll(
    @Query('name') searchByName: string,
  ): Promise<readonly ProductModel[]> {
    return this.productsService.getAll(searchByName);
  }

  @Get(':productId')
  getOne(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<ProductModel> {
    return this.productsService.getOneById(productId);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  addNewProduct(@Body() payload: NewProductDto): Promise<ProductModel> {
    return this.productsService.createNew(payload);
  }

  @Patch(':productId')
  updateProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() product: UpdateProductDto,
  ) {
    return this.productsService.update(productId, product);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('productId', ParseIntPipe) productId: number): Promise<number> {
    return this.productsService.removeById(productId);
  }
}
