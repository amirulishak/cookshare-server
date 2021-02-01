import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from '../user/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Recipe } from './recipe.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './comment.entity';

@EntityRepository(Recipe)
export class RecipeRepository extends Repository<Recipe> {
  private logger = new Logger('RecipeRepository');

  /**
   * Get Recipes
   * @param {User} user
   * @returns {Promise<Recipe[]>}
   */
  async getRecipes(user: User): Promise<Recipe[]> {
    const query = this.createQueryBuilder('recipe');

    query.where('recipe.creatorId = :userId', { userId: user.id });

    try {
      const recipes = await query.getMany();
      return recipes;
    } catch (error) {
      this.logger.error(
        `Failed to get the recipes for user "${user.email}"`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  /**
   * Add Comment to a Recipe
   * @param {CreateCommentDto} CreateCommentDto
   * @param {Recipe} recipe
   * @param {User} user
   * @returns {Promise<Comment>}
   */
  async addComment(
    CreateCommentDto: CreateCommentDto,
    recipe: Recipe,
    user: User,
  ): Promise<Comment> {
    const { text } = CreateCommentDto;

    const comment = new Comment();
    comment.creatorId = user.id;
    comment.recipeId = recipe.id;
    comment.text = text;

    try {
      await comment.save();
    } catch (error) {
      this.logger.error(
        `Failed to add comment for the recipe ID "${
          comment.recipeId
        }", Data: ${JSON.stringify(CreateCommentDto)}`,
        error.stack,
      );

      throw new InternalServerErrorException();
    }

    delete comment.creator;
    return await comment;
  }

  /**
   * Save Recipe
   * @param {Recipe} recipe
   * @param {CreateRecipeDto} recipeDto
   * @returns {Promise<Recipe>}
   */
  async saveRecipe(
    recipe: Recipe,
    recipeDto: CreateRecipeDto,
  ): Promise<Recipe> {
    const {
      name,
      story,
      portion,
      cookTime,
      thumbnailUrl,
      ingredients,
      steps,
    } = recipeDto;

    recipe.name = name.trim();
    recipe.story = story;
    recipe.portion = portion;
    recipe.cookTime = cookTime;
    recipe.thumbnailUrl = thumbnailUrl;
    recipe.ingredients = ingredients;
    recipe.steps = steps.map(({ description, attachmentUrl }) => {
      return { description, attachmentUrl };
    });

    try {
      await recipe.save();
    } catch (error) {
      this.logger.error(
        `Failed to save the recipe for user "${
          recipe.creator.email
        }", Data: ${JSON.stringify(recipeDto)}`,
        error.stack,
      );

      throw new InternalServerErrorException();
    }

    return await recipe;
  }
}
