import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateOrderDto {
    @IsNotEmpty()
    @IsString()
    status: string;
}
