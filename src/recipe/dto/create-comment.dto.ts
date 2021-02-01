import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'I did this recipe for lunch, it was so delicious.' })
  @MaxLength(500)
  text: string;
}
