import { CreateStoreDto } from './dto/create-store.dto';

export interface Store extends CreateStoreDto {
    id: number;
}