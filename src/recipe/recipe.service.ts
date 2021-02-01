import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Recipe } from './recipe.entity';
import { RecipeRepository } from './recipe.repository';

/**
 * Recipe Service
 */
@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(RecipeRepository)
    private recipeRepository: RecipeRepository,
  ) {}

  /**
   * Create Recipe
   * @param {CreateRecipeDto} CreateRecipeDto
   * @param {User} user
   * @returns {Promise<Recipe>}
   */
  async createRecipe(
    CreateRecipeDto: CreateRecipeDto,
    user: User,
  ): Promise<Recipe> {
    const recipe = new Recipe();
    recipe.creatorId = user.id;
    return await this.recipeRepository.saveRecipe(recipe, CreateRecipeDto);
  }

  /**
   * Get Recipes
   * @param {User} user
   * @returns {Promise<Recipe[]>}
   */
  getRecipes(user: User): Promise<Recipe[]> {
    return this.recipeRepository.getRecipes(user);
  }

  /**
   * Get Recipe By Id
   * @param {number} id
   * @param {User} user
   * @returns {Promise<Recipe>}
   */
  async getRecipeById(id: number, user?: User): Promise<Recipe> {
    const findOptions = user ? { where: { id, creatorId: user.id } } : { id };

    const recipe = await this.recipeRepository.findOne(findOptions);

    if (!recipe) throw new NotFoundException('Recipe not found');
    return recipe;
  }

  /**
   * Delete Recipe By Id
   * @param {number} id
   * @param {User} user
   * @returns {Promise<void>}
   */
  async deleteRecipe(id: number, user: User): Promise<void> {
    const result = await this.recipeRepository.delete({
      id,
      creatorId: user.id,
    });

    if (result.affected === 0) throw new NotFoundException('Recipe not found');
  }

  /**
   * Update Recipe By Id
   * @param {number} id
   * @param {CreateRecipeDto} CreateRecipeDto
   * @returns {Promise<Recipe>}
   */
  async updateRecipe(
    id: number,
    CreateRecipeDto: CreateRecipeDto,
    user: User,
  ): Promise<Recipe> {
    const recipe = await this.getRecipeById(id, user);
    return await this.recipeRepository.saveRecipe(recipe, CreateRecipeDto);
  }

  /**
   * Add Comment By Recipe Id
   * @param {number} id
   * @param {CreateCommentDto} CreateCommentDto
   * @param {User} user
   * @returns {Promise<Comment>}
   */
  async addComment(
    id: number,
    CreateCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    const recipe = await this.getRecipeById(id);
    return await this.recipeRepository.addComment(
      CreateCommentDto,
      recipe,
      user,
    );
  }
}
