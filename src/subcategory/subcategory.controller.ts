import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from 'src/subcategory/dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from 'src/subcategory/dto/update-subcategory.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequireRoles } from 'src/auth/decorators/roles.decorator';
import { Roles } from 'src/auth/constants/roles.enum';

@Controller('subcategories')
@UseGuards(JwtAuthGuard)
export class SubcategoryController {
    constructor(private readonly subcategoryService: SubcategoryService) { }

    @Post()
    @RequireRoles(Roles.ADMIN)
    create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
        return this.subcategoryService.create(createSubcategoryDto);
    }

    @Get()
    findAll(@Query('categoryId') categoryId?: string) {
        if (categoryId) {
            return this.subcategoryService.findByCategoryId(categoryId);
        }
        return this.subcategoryService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.subcategoryService.findOne(id);
    }

    @Put(':id')
    @RequireRoles(Roles.ADMIN)
    update(@Param('id') id: string, @Body() updateSubcategoryDto: UpdateSubcategoryDto) {
        return this.subcategoryService.update(id, updateSubcategoryDto);
    }

    @Delete(':id')
    @RequireRoles(Roles.ADMIN)
    remove(@Param('id') id: string) {
        return this.subcategoryService.remove(id);
    }
}
