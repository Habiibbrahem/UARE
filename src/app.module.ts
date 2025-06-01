import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { StoreModule } from './store/store.module';
import { ProductModule } from './product/product.module';
import { OrdersModule } from './orders/orders.module';
import { CategoryModule } from './category/category.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),

        // serve uploads/ at GET /uploads/*
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
            serveRoot: '/uploads',
        }),

        MongooseModule.forRoot('mongodb://localhost:27017/pfe'),

        AdminModule,
        UserModule,
        AuthModule,
        StoreModule,
        ProductModule,
        OrdersModule,
        CategoryModule,
    ],
})
export class AppModule {
    private readonly logger = new Logger(AppModule.name);
    constructor() {
        this.logger.log('AppModule initialized');
    }
}
