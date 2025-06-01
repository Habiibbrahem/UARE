// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { Product, ProductSchema } from './entities/product.entity';
import { Store, StoreSchema } from '../store/entities/store.entity';
import { CategoryModule } from '../category/category.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [
    // ← add this
    MulterModule.register({ dest: './uploads' }),
    // ← existing
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Store.name, schema: StoreSchema },
    ]),
    CategoryModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule { }
