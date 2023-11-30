import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ProductsService } from '../products/products/products.service';

@Module({
  imports: [ProductsService],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
