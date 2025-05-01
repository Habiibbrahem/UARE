import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Product } from './product/entities/product.entity';

@Controller('test')
export class TestController {
  constructor(
    @InjectRepository(Product)
    private productRepo: MongoRepository<Product>,
  ) { }

  @Get('create-product')
  async testCreate() {
    const testProduct = {
      name: "Test Product",
      price: 100,
      quantity: 10
    };

    const created = await this.productRepo.save(testProduct);
    return {
      message: "Product created!",
      product: created
    };
  }

  @Get('list-products')
  async testList() {
    return await this.productRepo.find();
  }
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
