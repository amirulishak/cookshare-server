import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { RecipeModule } from './recipe/recipe.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypegooseModule.forRoot(
      'mongodb+srv://mongo:mongo@cluster0.3omnd.mongodb.net/cookshare?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
      },
    ),
    RecipeModule,
    UserModule,
    AuthModule,
    ImageModule,
  ],
})
export class AppModule {}
