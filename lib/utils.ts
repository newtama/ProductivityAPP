import { Category } from '../types';

/**
 * Determines the category of a task based on its star rating.
 * This provides a consistent logic for categorizing items across the app.
 * 5 stars: Make Money
 * 3-4 stars: Increase Rate
 * 1-2 stars: Give Energy
 * @param rating The star rating of the item (1-5).
 * @returns The corresponding Category enum.
 */
export const getCategoryFromRating = (rating: number): Category | null => {
  if (rating >= 5) {
    return Category.MAKE_MONEY;
  }
  if (rating >= 3) {
    return Category.INCREASE_RATE;
  }
  if (rating > 0) {
    return Category.GIVE_ENERGY;
  }
  return null;
};
