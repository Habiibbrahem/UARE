import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Store, StoreSchema } from '../store/entities/store.entity';
import { User, UserSchema } from '../user/user.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Store.name, schema: StoreSchema },
            { name: User.name, schema: UserSchema }
        ]),
    ],
    providers: [AdminService],
    controllers: [AdminController],
})
export class AdminModule { }