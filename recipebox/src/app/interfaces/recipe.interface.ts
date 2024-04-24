import { User, Section } from '.';

export interface Recipe {
  id: number;
  title: string;
  time: string;
  time_unit: string;
  pinned: boolean;
  ingredients: Ingredient[];
  directions: Direction[];
  sections: Section[];
  user_id: number;
  user: User;
}

export interface Ingredient {
  id: number;
  name: string;
  amount: string;
  amount_unit: string;
  recipe_id: number;
  recipe: Recipe;
}

export interface Direction {
  id: number;
  description: string;
  recipe_id: number;
  recipe: Recipe;
}
