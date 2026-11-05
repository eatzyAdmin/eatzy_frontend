import type { AddToCartRequest, CartItem } from '@repo/types';

type Choice = { id: string | number };
type Customization = {
  variant?: Choice;
  addons: Choice[];
  groups?: { options: Choice[] }[];
};

/** The drawer exposes the same selection in both legacy fields and grouped fields. */
export function selectedMenuOptions(payload: Customization): { id: number }[] {
  const choices = [
    ...(payload.variant ? [payload.variant] : []),
    ...payload.addons,
    ...(payload.groups ?? []).flatMap(group => group.options),
  ];
  return Array.from(new Set(choices.map(choice => Number(choice.id))), id => ({ id }));
}

/** A cart line is identified by its dish AND its set of selected menu options. */
export function addCartItem(
  cartItems: CartItem[], dishId: number, quantity: number, options: { id: number }[] = [],
): AddToCartRequest['cartItems'] {
  const selected = Array.from(new Set(options.map(option => option.id)));
  const items: AddToCartRequest['cartItems'] = cartItems.map(item => ({
    id: item.id,
    dish: { id: item.dish.id },
    quantity: item.quantity,
    cartItemOptions: item.cartItemOptions?.map(option => ({
      id: option.id, menuOption: { id: option.menuOption.id },
    })),
  }));
  const existing = items.find(item => {
    if (item.dish.id !== dishId) return false;
    const ids = new Set(item.cartItemOptions?.map(option => option.menuOption.id) ?? []);
    return ids.size === selected.length && selected.every(id => ids.has(id));
  });
  if (existing) existing.quantity += quantity;
  else items.push({ dish: { id: dishId }, quantity,
    cartItemOptions: selected.map(id => ({ menuOption: { id } })),
  });
  return items;
}
