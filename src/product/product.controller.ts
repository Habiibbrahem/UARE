import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StoreMemberGuard } from '../guards/store-member.guard';  // Import the new guard
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';  // Import JwtAuthGuard to ensure user is set
import { Request as ExpressRequest } from 'express';  // Import ExpressRequest to type the request object

@Controller('products')
@UseGuards(JwtAuthGuard)  // Use JwtAuthGuard to ensure the user is authenticated
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  // CREATE (POST /products)
  @UseGuards(StoreMemberGuard) // Only store members can create products
  @Post()
  create(@Body() createProductDto: CreateProductDto, @Request() req: ExpressRequest) {
    const user = req.user;  // Extract the user from the request
    return this.productService.create(createProductDto, user);  // Pass the user to the service
  }

  // READ ALL (GET /products)
  @Get()
  @UseGuards(StoreMemberGuard) // Only store members can view products  
  async findAll() {
    return this.productService.findAll();
  }

  // READ ONE (GET /products/:id)
  @Get(':id')
  @UseGuards(StoreMemberGuard) // Only store members can view a single product
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(StoreMemberGuard) // Only store members can update products
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(StoreMemberGuard) // Only store members can delete products  
  async remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  // GET BY STORE (GET /products/store/:storeId)
  @Get('store/:storeId')
  async findByStore(@Param('storeId') storeId: string) {
    return this.productService.findByStore(storeId);
  }
}
