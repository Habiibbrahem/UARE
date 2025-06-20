// src/products/product.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RequireRoles } from 'src/auth/decorators/roles.decorator';
import { Roles } from 'src/auth/constants/roles.enum';
import { RequestWithUser } from '../types/request-with-user.type';

// Configure Multer to write into <project-root>/uploads
function imageFileInterceptor() {
  return FileInterceptor('image', {
    storage: diskStorage({
      destination: join(__dirname, '../../uploads'),
      filename: (_req, file, cb) => {
        const name = 'image-' + Date.now();
        const fileExt = extname(file.originalname);
        cb(null, `${name}${fileExt}`);
      },
    }),
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(new BadRequestException('Only image files are allowed!'), false);
      } else {
        cb(null, true);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  });
}

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  /** Create a product (with optional image upload) */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.STORE_OWNER, Roles.STORE_MEMBER, Roles.ADMIN)
  @UseInterceptors(imageFileInterceptor())
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: CreateProductDto,
    @Request() req: RequestWithUser,
  ) {
    const image = file ? `/uploads/${file.filename}` : undefined;
    return this.productService.create({ ...createDto, image }, req.user);
  }

  /** Get all products (public) */
  @Get()
  findAll() {
    return this.productService.findAll();
  }
  /** Search by name or description (public) */
  @Get('search')
  search(@Query('q') q: string) {
    return this.productService.search(q);
  }

  /** Filter products by storeId/categoryId/minPrice/maxPrice (public) */
  @Get('search/filter')
  filterProducts(
    @Query('storeId') storeId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    const filter: any = {};
    if (storeId) filter.storeId = storeId;
    if (categoryId) filter.categoryId = categoryId;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    return this.productService.findAll(filter);
  }

  /** Get products by store (public) */
  @Get('store/:storeId')
  findByStore(@Param('storeId') storeId: string) {
    return this.productService.findByStore(storeId);
  }

  /** Get products by category (public) */
  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.productService.findByCategory(categoryId);
  }

  /** Get one product by ID (public) */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  /** Update a product (with optional image upload) */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.STORE_OWNER, Roles.STORE_MEMBER, Roles.ADMIN)
  @UseInterceptors(imageFileInterceptor())
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDto: UpdateProductDto,
    @Request() req: RequestWithUser,
  ) {
    const image = file ? `/uploads/${file.filename}` : undefined;
    const payload = image ? { ...updateDto, image } : updateDto;
    return this.productService.update(id, payload, req.user);
  }

  /** Delete a product by ID */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequireRoles(Roles.STORE_OWNER, Roles.STORE_MEMBER, Roles.ADMIN)
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.productService.remove(id, req.user);
  }
}
