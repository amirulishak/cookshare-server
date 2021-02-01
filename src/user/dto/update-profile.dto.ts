import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl, MaxLength } from 'class-validator';
import { IsNotBlank } from '../../shared/decorators/is-not-blank.decorator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotBlank()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'http://www.yourwebsite.com' })
  @IsOptional()
  @IsUrl()
  @MaxLength(60)
  website: string;

  @ApiProperty({
    example:
      'No culinary experience. Watched a lot of food show, and just cooking new things.',
  })
  @IsOptional()
  @MaxLength(255)
  bio: string;

  @ApiProperty({
    example: 'Damansara, Selangor',
  })
  @IsOptional()
  @MaxLength(255)
  location: string;

  @ApiProperty({
    example: 'https://randomuser.me/api/portraits/men/74.jpg',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(1000)
  avatarUrl: string;
}
