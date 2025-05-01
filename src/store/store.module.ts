import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { Store, StoreSchema } from './entities/store.entity';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
    ],
    controllers: [StoreController],
    providers: [StoreService],
    exports: [
        StoreService,
        MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]) // Export the model
    ],
})
export class StoreModule { }