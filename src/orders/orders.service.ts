import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>
    ) { }

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        const createdOrder = new this.orderModel(createOrderDto);
        return createdOrder.save();
    }

    async findAll(): Promise<Order[]> {
        return this.orderModel.find().exec();
    }

    async findOne(id: string): Promise<Order | null> {
        const order = await this.orderModel.findById(id).exec();
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        return order;
    }

    // Update Order Status
    async updateStatus(id: string, status: string): Promise<Order | null> {
        const order = await this.orderModel.findById(id).exec();
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Ensure the status is valid
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            throw new BadRequestException('Invalid status');
        }

        // Update the status of the order
        order.status = status;
        return order.save();
    }

    // Cancel Order
    async cancelOrder(id: string): Promise<Order | null> {
        const order = await this.orderModel.findById(id).exec();
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Only allow cancelling if the order status is Pending or Processing
        if (order.status !== 'pending' && order.status !== 'processing') {
            throw new BadRequestException('Cannot cancel this order');
        }

        // Cancel the order (change status to 'cancelled')
        order.status = 'cancelled';
        return order.save();
    }

    async findLastOrderToday(): Promise<Order | null> {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);  // Set to the beginning of today

        return this.orderModel.findOne({
            orderDate: { $gte: startOfDay }  // Find orders created today
        }).sort({ orderDate: -1 }).exec();  // Sort by orderDate in descending order
    }
}
