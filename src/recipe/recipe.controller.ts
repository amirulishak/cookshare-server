import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { GetUser } from '../shared/decorators/get-user.decorator';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Recipe } from './recipe.entity';
import { RecipeService } from './recipe.service';

/**
 * Recipe Controller
 */
@ApiTags('recipe')
@ApiBearerAuth('JWT')
@Controller('recipe')
@UseGuards(AuthGuard())
export class RecipeController {
  private logger = new Logger('RecipeController');

  constructor(private recipeService: RecipeService) {}

  /**
   * Create Recipe
   * [POST]: api/v1/recipe
   * @param {CreateRecipeDto} recipeDto
   * @param {User} user
   * @returns {Promise<Recipe>}
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Persists a newly created recipe to database' })
  createRecipe(
    @Body() recipeDto: CreateRecipeDto,
    @GetUser() user: User,
  ): Promise<Recipe> {
    this.logger.verbose(`User "${user.email}" creating a new recipe`);
    return this.recipeService.createRecipe(recipeDto, user);
  }

  /**
   * Get Recipes
   * [GET]: api/v1/recipe
   * @param {User} user
   * @returns {Promise<Recipe[]>}
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all recipes owned by current user' })
  getRecipes(@GetUser() user: User): Promise<Recipe[]> {
    return this.recipeService.getRecipes(user);
  }

  /**
   * Get Recipe By Id
   * [GET]: api/v1/recipe/id
   * @param {number} id
   * @param {User} user
   * @returns {Promise<Recipe>}
   */
  @Get('/:id')
  @ApiOperation({
    summary: 'Retrieve a recipe by ID owned by current user.',
  })
  getRecipeById(
    @Param('id', ParseIntPipe) id: string,
    @GetUser() user: User,
  ): Promise<Recipe> {
    return this.recipeService.getRecipeById(id, user);
  }

  /**
   * Delete Recipe By Id
   * [DELETE]: api/v1/recipe/id
   * @param {number} id
   * @param {User} user
   * @returns {Promise<void>}
   */
  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete a recipe by ID owned by current user.',
  })
  deleteRecipe(
    @Param('id', ParseIntPipe) id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.recipeService.deleteRecipe(id, user);
  }

  /**
   * Update Recipe By Id
   * [PATCH]: api/v1/recipe/id
   * @param {number} id
   * @param {CreateRecipeDto} recipeDto
   * @param {User} user
   * @returns {Promise<Recipe>}
   */
  @Patch('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Update a recipe by ID owned by current user.',
  })
  updateRecipe(
    @Param('id', ParseIntPipe) id: string,
    @Body() recipeDto: CreateRecipeDto,
    @GetUser() user: User,
  ): Promise<Recipe> {
    this.logger.verbose(`User "${user.email}" updating a new recipe`);
    return this.recipeService.updateRecipe(id, recipeDto, user);
  }

  /**
   * Add Comment By Recipe Id
   * [POST]: api/v1/recipe/id/comment
   * @param {number} recipeId
   * @param {CreateCommentDto} commentDto
   * @param {User} user
   * @returns {Promise<Comment>}
   */
  @Post('/:recipeId/comment')
  @ApiOperation({
    summary: 'Add a comment to a recipe by ID.',
  })
  addComment(
    @Param('recipeId', ParseIntPipe) recipeId: string,
    @Body() commentDto: CreateCommentDto,
    @GetUser() user: User,
  ): Promise<Comment> {
    return this.recipeService.addComment(recipeId, commentDto, user);
  }
}
