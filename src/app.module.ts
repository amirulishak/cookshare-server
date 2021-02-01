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
    TypegooseModule.forRoot('mongodb://localhost:27017/imageapi', {
      useNewUrlParser: true,
    }),
    RecipeModule,
    UserModule,
    AuthModule,
    ImageModule,
  ],
})
export class AppModule {}
