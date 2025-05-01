import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from './entities/order.entity';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    StoreModule, // This provides both StoreService and StoreModel
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  // Remove StoreService from providers here - it comes from StoreModule
})
export class OrdersModule { }