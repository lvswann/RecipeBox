import { Recipe, Section } from ".";

export interface User {
  id: number;
  public_id: string;
  username: string;
  email: string;
  password_hash: string;
  recipes: Recipe[];
  sections: Section[];
}
