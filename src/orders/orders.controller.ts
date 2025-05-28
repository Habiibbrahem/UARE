import { Controller, Post, Body, Get, Param, Patch, UseGuards, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/constants/roles.enum';
import { SetMetadata } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentMethod } from './constants/order.constants';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    async createOrder(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(createOrderDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('cash-on-delivery')
    async createCashOnDeliveryOrder(@Body() createOrderDto: CreateOrderDto) {
        createOrderDto.paymentMethod = PaymentMethod.CASH_ON_DELIVERY;
        return this.ordersService.create(createOrderDto);
    }

    @Get(':id')
    async getOrder(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    // Updated: optional storeId query parameter to filter orders by store
    @Get()
    async getAllOrders(@Query('storeId') storeId?: string) {
        if (storeId) {
            return this.ordersService.findByStore(storeId);
        }
        return this.ordersService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('role', Roles.STORE_OWNER)
    @Patch(':id/status')
    async updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.ordersService.updateStatus(id, status);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('role', Roles.STORE_OWNER)
    @Patch(':id/confirm-delivery')
    async confirmDelivery(@Param('id') id: string) {
        return this.ordersService.confirmDelivery(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('role', Roles.STORE_OWNER)
    @Patch(':id/cancel')
    async cancelOrder(@Param('id') id: string) {
        return this.ordersService.cancelOrder(id);
    }
}
