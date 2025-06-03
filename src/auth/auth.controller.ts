import {
    Controller,
    Post,
    Body,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from './constants/roles.enum';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        console.log(`User ${user.email} with role ${user.role} logged in`);
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        try {
            return await this.authService.register({
                ...createUserDto,
                role: createUserDto.role ?? Roles.CUSTOMER,
            });
        } catch (error) {
            if (error.code === 11000) {
                // MongoDB duplicate key error
                throw new ConflictException('Email already exists');
            }
            throw error;
        }
    }
}