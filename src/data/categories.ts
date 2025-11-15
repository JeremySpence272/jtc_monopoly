import categoriesData from './categories.json';

export interface Category {
  category_id: string;
  category_name: string;
  category_color: string;
}

export const CATEGORIES = categoriesData as Category[];

export function getCategoryByColor(color: string): Category | undefined {
  return CATEGORIES.find(cat => cat.category_color === color);
}

export function getCategoryById(categoryId: string): Category | undefined {
  return CATEGORIES.find(cat => cat.category_id === categoryId);
}

