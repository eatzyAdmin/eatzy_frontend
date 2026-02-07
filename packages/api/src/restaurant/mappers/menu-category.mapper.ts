import type { MenuCategory } from "../../../../types/src";
import type { MenuCategoryDTO } from "../menu-category.api";

export function mapCategoryDTOToMenuCategory(dto: MenuCategoryDTO): MenuCategory {
  return {
    id: String(dto.id),
    name: dto.name,
    restaurantId: dto.restaurant?.id ? String(dto.restaurant.id) : '',
    displayOrder: dto.displayOrder || 0,
  };
}

export function mapMenuCategoryToDTO(category: MenuCategory, restaurantId: number): MenuCategoryDTO {
  return {
    id: Number(category.id) || 0,
    name: category.name,
    restaurant: { id: restaurantId },
    displayOrder: category.displayOrder,
  };
}
