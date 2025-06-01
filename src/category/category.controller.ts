// src/categories/category.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Query,
    UseGuards,
    BadRequestException,
    Request,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/category/dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RequireRoles } from 'src/auth/decorators/roles.decorator';
import { Roles } from 'src/auth/constants/roles.enum';
import { RequestWithUser } from 'src/types/request-with-user.type';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN, Roles.STORE_MEMBER)
    create(
        @Body() createCategoryDto: CreateCategoryDto,
        @Request() req: RequestWithUser
    ) {
        // Store members must specify a parent
        if (
            req.user.role === Roles.STORE_MEMBER &&
            !createCategoryDto.parentId
        ) {
            throw new BadRequestException(
                'Store members must supply a parentId'
            );
        }
        return this.categoryService.create(createCategoryDto);
    }

    @Get()
    findAll(@Query('parentId') parentId?: string) {
        return this.categoryService.findAll(parentId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN)
    update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto
    ) {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @RequireRoles(Roles.ADMIN)
    remove(@Param('id') id: string) {
        return this.categoryService.remove(id);
    }
}
