import { User, Section } from '.';

export enum TimeUnit {
  MINUTES = 'minutes',
  HOURS = 'hours'
}

export interface Recipe {
  id: number;
  title: string;
  time: number;
  time_unit: TimeUnit;
  pinned: boolean;
  date: Date;
  ingredients: Ingredient[];
  directions: Direction[];
  sections: Section[];
  user_id: number;
  user: User;
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
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
