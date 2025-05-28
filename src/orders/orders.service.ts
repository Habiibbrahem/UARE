import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentMethod, OrderStatus, PaymentStatus, OrderStatusFlow } from './constants/order.constants';
import { OrderHelper } from './helpers/order.helper';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        private readonly orderHelper: OrderHelper
    ) { }

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        const orderNumber = await this.orderHelper.generateOrderNumber();

        const orderData = {
            ...createOrderDto,
            orderNumber,
            orderDate: new Date(),
            status: OrderStatus.PENDING,
            paymentStatus: createOrderDto.paymentMethod === PaymentMethod.CASH_ON_DELIVERY
                ? PaymentStatus.PENDING
                : PaymentStatus.PENDING
        };

        const createdOrder = new this.orderModel(orderData);
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

    // NEW: Find orders by storeId
    async findByStore(storeId: string): Promise<Order[]> {
        return this.orderModel.find({ storeId }).exec();
    }

    async updateStatus(id: string, status: string): Promise<Order | null> {
        const order = await this.orderModel.findById(id).exec();
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const currentStatusIndex = OrderStatusFlow.indexOf(order.status as OrderStatus);
        const newStatusIndex = OrderStatusFlow.indexOf(status as OrderStatus);

        if (newStatusIndex === -1 || (newStatusIndex !== 0 && newStatusIndex < currentStatusIndex)) {
            throw new BadRequestException('Invalid status transition');
        }

        if (status === OrderStatus.DELIVERED && order.paymentMethod === PaymentMethod.CASH_ON_DELIVERY) {
            order.paymentStatus = PaymentStatus.PAID;
            order.deliveredAt = new Date();
        }

        order.status = status;
        return order.save();
    }

    async confirmDelivery(id: string): Promise<Order | null> {
        const order = await this.orderModel.findById(id).exec();
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.status !== OrderStatus.SHIPPED) {
            throw new BadRequestException('Order must be shipped before delivery confirmation');
        }

        if (order.paymentMethod === PaymentMethod.CASH_ON_DELIVERY) {
            order.paymentStatus = PaymentStatus.PAID;
        }

        order.status = OrderStatus.DELIVERED;
        order.deliveredAt = new Date();
        return order.save();
    }

    async cancelOrder(id: string): Promise<Order | null> {
        const order = await this.orderModel.findById(id).exec();
        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.PROCESSING) {
            throw new BadRequestException('Cannot cancel this order');
        }

        order.status = OrderStatus.CANCELLED;
        return order.save();
    }

    async findLastOrderToday(): Promise<Order | null> {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        return this.orderModel.findOne({
            orderDate: { $gte: startOfDay }
        }).sort({ orderDate: -1 }).exec();
    }
}
