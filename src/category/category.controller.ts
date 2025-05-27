import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/category/dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequireRoles } from 'src/auth/decorators/roles.decorator';
import { Roles } from 'src/auth/constants/roles.enum';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @RequireRoles(Roles.ADMIN)
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    // Public route: get categories
    // Optional query param to get children of a parent category
    @Get()
    findAll(@Query('parentId') parentId?: string) {
        if (parentId) {
            return this.categoryService.findChildren(parentId);
        }
        return this.categoryService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @RequireRoles(Roles.ADMIN)
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @RequireRoles(Roles.ADMIN)
    remove(@Param('id') id: string) {
        return this.categoryService.remove(id);
    }
}
