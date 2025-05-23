import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller'; // <-- import controller
import { StoreModule } from '../store/store.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    StoreModule,],
  controllers: [UserController], // <-- add controller here
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { };
