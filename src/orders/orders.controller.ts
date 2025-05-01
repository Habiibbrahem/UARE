import { Controller, Post, Body, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/constants/roles.enum';
import { SetMetadata } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Assuming you have JWT guard

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    async createOrder(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(createOrderDto);
    }

    @Get(':id')
    async getOrder(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Get()
    async getAllOrders() {
        return this.ordersService.findAll();
    }

    // Only store owners can update order status
    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('role', Roles.STORE_OWNER) // Restrict to store owners
    @Patch(':id/status')
    async updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.ordersService.updateStatus(id, status);
    }

    // Only store owners can cancel orders
    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('role', Roles.STORE_OWNER) // Restrict to store owners
    @Patch(':id/cancel')
    async cancelOrder(@Param('id') id: string) {
        return this.ordersService.cancelOrder(id);
    }
}
