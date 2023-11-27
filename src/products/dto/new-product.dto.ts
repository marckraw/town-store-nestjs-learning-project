import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  IsInt,
  IsPositive,
} from 'class-validator';

export class NewProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @IsUrl({ require_protocol: true })
  image: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsInt()
  @IsOptional()
  @IsPositive()
  stock?: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  categoryId: number;
}
