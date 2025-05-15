import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; 
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { StoreModule } from './store/store.module';
import { ProductModule } from './product/product.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),

        MongooseModule.forRoot('mongodb://localhost:27017/pfe'), 

        AdminModule,
        UserModule,
        AuthModule,
        StoreModule,
        ProductModule,
        OrdersModule,
        CategoryModule,
        SubcategoryModule,
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
