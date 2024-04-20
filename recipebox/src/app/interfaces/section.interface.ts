import { User, Recipe } from '.';

export interface Section {
  id: number;
  title: string;
  description: string;
  recipes: Recipe[];
  user_id: number;
  user: User;
}
