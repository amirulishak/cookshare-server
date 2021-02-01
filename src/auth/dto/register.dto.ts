import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';
import { IsNotBlank } from 'src/shared/decorators/is-not-blank.decorator';
import { AuthDto } from './auth.dto';

export class RegisterDto extends AuthDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotBlank()
  @MaxLength(100)
  name: string;
}
