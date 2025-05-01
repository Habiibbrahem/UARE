import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Replace TypeORM with Mongoose
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { StoreModule } from './store/store.module';
import { ProductModule } from './product/product.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),

        // Replace TypeORM with Mongoose
        MongooseModule.forRoot('mongodb://localhost:27017/pfe'), // MongoDB connection

        AdminModule,
        UserModule,
        AuthModule,
        StoreModule,
        ProductModule,
        OrdersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
    private readonly logger = new Logger(AppModule.name);

    constructor() {
        this.logger.log('AppModule initialized');
    }
}
