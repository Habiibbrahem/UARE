import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { Roles } from '../auth/constants/roles.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../user/user.entity';
import { Types } from 'mongoose'; // Changed from mongodb to mongoose 

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async register(createUserDto: CreateUserDto) {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        console.log('Hashed Password:', hashedPassword); // Debugging line
        return this.userService.create({
            ...createUserDto,
            password: hashedPassword,
        });
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.findByEmail(email.trim());
        if (!user) {
            console.log(`User ${email} not found`);
            return null;
        }

        console.log('Found user:', {
            email: user.email,
            role: user.role,
            hashedPassword: user.password.substring(0, 15) + '...'
        });

        const match = await bcrypt.compare(password.trim(), user.password);
        console.log(`Password match: ${match}`);

        if (!match) {
            console.log('Debug: Generated hash for comparison:',
                await bcrypt.hash(password.trim(), 10));
        }

        return match ? user : null;
    }

    async login(user: User) {
        const payload = {
            email: user.email,
            sub: (user._id as Types.ObjectId).toString(), // Added type assertion
            role: user.role,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async refreshToken(user: any) {
        const payload = {
            email: user.email,
            sub: (user._id as Types.ObjectId).toString(), // Added type assertion 
            role: user.role
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
};
