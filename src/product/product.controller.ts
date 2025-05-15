import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  Query
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/constants/roles.enum';
import { RequireRoles } from 'src/auth/decorators/roles.decorator';
import { RequestWithUser } from '../types/request-with-user.type';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.STORE_OWNER, Roles.STORE_MEMBER, Roles.ADMIN)
  create(
    @Body() createProductDto: CreateProductDto,
    @Request() req: RequestWithUser
  ) {
    return this.productService.create(createProductDto, req.user);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.STORE_OWNER, Roles.STORE_MEMBER, Roles.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req: RequestWithUser
  ) {
    return this.productService.update(id, updateProductDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.STORE_OWNER, Roles.ADMIN)
  remove(
    @Param('id') id: string,
    @Request() req: RequestWithUser
  ) {
    return this.productService.remove(id, req.user);
  }

  @Get('store/:storeId')
  findByStore(@Param('storeId') storeId: string) {
    return this.productService.findByStore(storeId);
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.productService.findByCategory(categoryId);
  }

  @Get('subcategory/:subcategoryId')
  findBySubcategory(@Param('subcategoryId') subcategoryId: string) {
    return this.productService.findBySubcategory(subcategoryId);
  }

  @Get('search/filter')
  filterProducts(
    @Query('storeId') storeId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('subcategoryId') subcategoryId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string
  ) {
    const filter: any = {};

    if (storeId) filter.storeId = storeId;
    if (categoryId) filter.categoryId = categoryId;
    if (subcategoryId) filter.subcategoryId = subcategoryId;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    return this.productService.findAll(filter);
  }
}