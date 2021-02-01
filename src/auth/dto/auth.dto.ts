import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length, MaxLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'Johndoe123' })
  @Length(8, 32)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'password is too weak',
  // })
  password: string;
}
