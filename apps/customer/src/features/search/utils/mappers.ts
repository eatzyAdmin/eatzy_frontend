import type { Restaurant, Dish, MenuCategory, RestaurantMagazine } from '@repo/types';
import type { RestaurantWithMenu } from '../hooks/useSearch';

/**
 * Maps a RestaurantMagazine DTO from the backend to the UI-friendly RestaurantWithMenu format.
 * This includes generating placeholder dishes if none are provided and assigning a layout type.
 * 
 * @param magazine The restaurant magazine data from API
 * @param layoutIndex Index to determine layout type (1-10)
 * @returns RestaurantWithMenu formatted object
 */
export function mapMagazineToRestaurantWithMenu(
  magazine: RestaurantMagazine,
  layoutIndex: number
): RestaurantWithMenu {
  const menuCategories: MenuCategory[] = (magazine.category || []).map((cat, idx) => ({
    id: String(cat.id),
    name: cat.name,
    restaurantId: String(magazine.id),
    displayOrder: idx + 1,
  }));

  let dishes: Dish[] = (magazine.category || []).flatMap(cat =>
    (cat.dishes || []).map(dish => ({
      id: String(dish.id),
      name: dish.name,
      description: dish.description || '',
      price: dish.price,
      imageUrl: dish.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      restaurantId: String(magazine.id),
      menuCategoryId: String(cat.id),
      availableQuantity: 100,
      isAvailable: true,
      rating: magazine.averageRating || 4.5,
    }))
  );

  // Fallback: If no dishes, create a placeholder dish to prevent UI errors
  if (dishes.length === 0) {
    dishes = [{
      id: `placeholder-${magazine.id}`,
      name: magazine.name,
      description: magazine.description || 'Khám phá các món ăn tại đây',
      price: 0,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      restaurantId: String(magazine.id),
      menuCategoryId: 'default',
      availableQuantity: 0,
      isAvailable: true,
      rating: magazine.averageRating || 4.5,
    }];
  }

  const restaurant: Restaurant = {
    id: String(magazine.id),
    name: magazine.name,
    slug: magazine.slug,
    categories: [],
    status: 'OPEN',
    rating: magazine.averageRating || 0,
    address: magazine.address,
    description: magazine.description,
    imageUrl: dishes[0]?.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    reviewCount: (magazine.oneStarCount || 0) + (magazine.twoStarCount || 0) +
      (magazine.threeStarCount || 0) + (magazine.fourStarCount || 0) +
      (magazine.fiveStarCount || 0),
  };

  return {
    restaurant,
    dishes,
    menuCategories,
    layoutType: (layoutIndex % 10) + 1,
    distance: magazine.distance,
    finalScore: magazine.finalScore,
  };
}
