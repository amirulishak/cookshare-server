import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsOptional, IsUrl, MaxLength } from 'class-validator';

export class CreateRecipeDto {
  @ApiProperty({ example: 'Fried Chicken' })
  @MaxLength(55)
  name: string;

  @ApiProperty({
    example:
      'My mom used to make this dish when I was very small. I really loved it.',
  })
  @IsOptional()
  @MaxLength(500)
  story: string;

  @ApiProperty({ example: '2 Servings' })
  @IsOptional()
  @MaxLength(25)
  portion: string;

  @ApiProperty({ example: '1 Hour 2 Minutes' })
  @IsOptional()
  @MaxLength(25)
  cookTime: string;

  @ApiProperty({
    example:
      'https://static.toiimg.com/thumb/61589069.cms?width=1200&height=900',
  })
  @IsOptional()
  @IsUrl()
  thumbnailUrl: string;

  @ApiProperty({
    example: ['100 g of Chicken', '1 tbsp of Olive Oil'],
  })
  @ArrayNotEmpty()
  ingredients: string[];

  @ApiProperty({
    example: [
      {
        description:
          'Serve with a leaf lettuce salad with added sliced red onion and Kalamata olives.',
        attachmentUrl:
          'https://jovinacooksitalian.files.wordpress.com/2020/12/img_0004-1-2.jpg?w=768&h=768',
      },
      {
        description:
          'Bake an additional 15 minutes. Serve the sausage on the side.',
        attachmentUrl:
          'https://jovinacooksitalian.files.wordpress.com/2020/12/img_0006-2.jpg?w=768&h=768',
      },
    ],
  })
  @ArrayNotEmpty()
  steps: Array<{ description: string; attachmentUrl: string }>;
}
