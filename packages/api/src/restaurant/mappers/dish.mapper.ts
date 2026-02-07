import type { Dish } from "../../../../types/src";
import type { BackendDishDTO } from "../dish.api";

export function mapBackendDishToFrontend(dto: BackendDishDTO): Dish {
  return {
    id: String(dto.id),
    name: dto.name,
    description: dto.description || '',
    price: dto.price,
    imageUrl: dto.imageUrl || '',
    restaurantId: dto.restaurant?.id ? String(dto.restaurant.id) : '',
    menuCategoryId: dto.category?.id ? String(dto.category.id) : '',
    availableQuantity: dto.availabilityQuantity || 0,
    isAvailable: dto.availabilityQuantity > 0,
    optionGroups: dto.menuOptionGroups?.map(g => ({
      id: String(g.id),
      title: g.title,
      required: g.required,
      minSelect: g.minSelect,
      maxSelect: g.maxSelect,
      options: (g.options || []).map(o => ({
        id: String(o.id),
        name: o.name,
        price: o.price,
      })),
    })) || [],
  };
}

export function mapFrontendDishToBackend(
  dish: Omit<Dish, 'id'> & { id?: string },
  restaurantId?: number
): Record<string, unknown> {
  const rid = restaurantId || (dish.restaurantId ? Number(dish.restaurantId) : undefined);
  const cid = dish.menuCategoryId ? Number(dish.menuCategoryId) : undefined;

  return {
    id: dish.id && !dish.id.includes('-') ? Number(dish.id) : undefined,
    name: dish.name,
    description: dish.description,
    price: dish.price,
    imageUrl: dish.imageUrl,
    availabilityQuantity: dish.availableQuantity,
    // For POST (Dish entity)
    restaurant: rid ? { id: rid } : undefined,
    category: cid ? { id: cid } : undefined,
    // For PUT (ResDishDTO/Custom requests)
    restaurantId: rid,
    categoryId: cid,
    // Nested groups for updateDishWithMenuOptions
    menuOptionGroups: dish.optionGroups?.map(g => ({
      id: g.id && !g.id.includes('-') ? Number(g.id) : null,
      name: g.title,
      minChoices: g.minSelect || 0,
      maxChoices: g.maxSelect || 0,
      menuOptions: (g.options || []).map(o => ({
        id: o.id && !o.id.includes('-') ? Number(o.id) : null,
        name: o.name,
        priceAdjustment: o.price,
        isAvailable: true
      }))
    }))
  };
}
