'use client';

import React from 'react';
import { CheckCircle2 } from "@repo/ui/icons";
import type { Dish, MenuCategory } from "@repo/types";
import DishCard from "./DishCard";

interface RestaurantMenuProps {
  categories: MenuCategory[];
  allDishes: Dish[];
  cartItems: any[];
  isUpdating: boolean;
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
  onDishClick: (dish: Dish) => void;
  updateItemQuantity: (id: any, q: number) => Promise<void | any>;
  removeItem: (id: any) => Promise<void | any>;
}

export const RestaurantMenu: React.FC<RestaurantMenuProps> = ({
  categories,
  allDishes,
  cartItems,
  isUpdating,
  sectionRefs,
  onDishClick,
  updateItemQuantity,
  removeItem
}) => {
  // Helper to get dishes for a specific category
  const getDishesByCategoryId = (categoryId: string): Dish[] => {
    return allDishes.filter(dish => dish.menuCategoryId === categoryId);
  };

  // Helper to get count of a dish in cart
  const getDishCount = (dishId: string): number => {
    return cartItems
      .filter((item) => String(item.dish.id) === dishId)
      .reduce((sum: number, item) => sum + item.quantity, 0);
  };

  // Helper to get cart item for a dish
  const getCartItemForDish = (dishId: string) => {
    return cartItems.find((item) => String(item.dish.id) === dishId);
  };

  return (
    <div className="relative space-y-12 px-0 md:px-4">
      {categories.map((c) => {
        const dishes = getDishesByCategoryId(c.id);
        return (
          <section
            key={c.id}
            ref={(el) => { sectionRefs.current[c.id] = el; }}
            data-id={c.id}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <h2 className="text-[20px] md:text-[24px] font-bold text-[#1A1A1A] uppercase tracking-wide font-anton">
                {c.name}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
              {dishes.map((d) => {
                const count = getDishCount(d.id);
                const cartItem = getCartItemForDish(d.id);
                return (
                  <DishCard
                    key={d.id}
                    dish={d}
                    count={count}
                    isLoading={isUpdating}
                    onAdd={() => onDishClick(d)}
                    onRemove={async () => {
                      if (cartItem) {
                        if (cartItem.quantity <= 1) {
                          await removeItem(cartItem.id);
                        } else {
                          await updateItemQuantity(cartItem.id, cartItem.quantity - 1);
                        }
                      }
                    }}
                    onClick={() => onDishClick(d)}
                  />
                );
              })}
            </div>
          </section>
        );
      })}

      {/* End of list indicator */}
      <div className="py-12 flex items-center justify-center gap-4 opacity-60">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20" />
        <div className="flex flex-col items-center gap-2">
          <div className="">
            <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <span className="text-[14px] font-bold text-gray-400 uppercase font-anton">End of list</span>
        </div>
        <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent w-20" />
      </div>
    </div>
  );
};
