import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import { ProductModule } from '../products/product.module';
import { OrderModel } from './models/order.model';

@Module({
  imports: [ProductModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: 'OrderModel',
      useValue: OrderModel,
    },
  ],
})
export class OrdersModule {}
