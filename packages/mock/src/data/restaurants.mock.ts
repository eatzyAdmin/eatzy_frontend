import { RestaurantStatus as ModelRestaurantStatus } from "@repo/models";
import type { Restaurant as ModelRestaurant } from "@repo/models";
import type { Restaurant as TypeRestaurant, RestaurantDetail, Dish, MenuCategory } from "@repo/types";
import { MOCK_CATEGORIES } from "./categories.mock";

export interface MockFullRestaurant {
  id: number;
  name: string;
  slug: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  status: "OPEN" | "CLOSED" | "LOCKED";
  imageUrl: string;
  avatarUrl: string;
  coverImageUrl: string;
  description: string;
  rating: number;
  reviewCount: number;
  commissionRate: number;
  ownerId: number;
  ownerName: string;
  priceRange: string;
  deliveryTimeMinutes: number;
  deliveryFee: number;
  openingHours: {
    day: string;
    isOpen: boolean;
    shifts: { open: string; close: string }[];
  }[];
}

const standardOpeningHours = [
  { day: "Thứ 2", isOpen: true, shifts: [{ open: "07:00", close: "22:00" }] },
  { day: "Thứ 3", isOpen: true, shifts: [{ open: "07:00", close: "22:00" }] },
  { day: "Thứ 4", isOpen: true, shifts: [{ open: "07:00", close: "22:00" }] },
  { day: "Thứ 5", isOpen: true, shifts: [{ open: "07:00", close: "22:00" }] },
  { day: "Thứ 6", isOpen: true, shifts: [{ open: "07:00", close: "22:30" }] },
  { day: "Thứ 7", isOpen: true, shifts: [{ open: "07:00", close: "23:00" }] },
  { day: "Chủ nhật", isOpen: true, shifts: [{ open: "07:00", close: "23:00" }] },
];

export const MOCK_RESTAURANTS: MockFullRestaurant[] = [
  {
    id: 101,
    name: "Cơm Tấm Ba Ghiền",
    slug: "com-tam-ba-ghien",
    address: "84 Đặng Văn Ngữ, Phường 10, Phú Nhuận, TP.HCM",
    latitude: 10.7932,
    longitude: 106.6719,
    phone: "028 3846 1073",
    email: "baghien@eatzy.vn",
    category: {
      id: "2",
      name: "Cơm Tấm & Món Việt",
      slug: "com-tam",
    },
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=80",
    coverImageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
    description: "Cơm tấm sườn bì chả nướng than hoa trứ danh Sài Gòn, miếng sườn khổng lồ ướp đậm đà khó quên.",
    rating: 4.8,
    reviewCount: 1420,
    commissionRate: 15,
    ownerId: 2,
    ownerName: "Trần Thị Mai",
    priceRange: "45.000đ - 95.000đ",
    deliveryTimeMinutes: 20,
    deliveryFee: 16000,
    openingHours: standardOpeningHours,
  },
  {
    id: 102,
    name: "Phở Thìn Lò Đúc - Chi Nhánh Sài Gòn",
    slug: "pho-thin-lo-duc",
    address: "110 Lê Thị Hồng Gấm, Phường Nguyễn Thái Bình, Quận 1, TP.HCM",
    latitude: 10.7698,
    longitude: 106.6974,
    phone: "090 912 3456",
    email: "phothin@eatzy.vn",
    category: {
      id: "1",
      name: "Phở & Bún",
      slug: "pho-bun",
    },
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1582878826629-297527132b04?w=800&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=200&q=80",
    coverImageUrl: "https://images.unsplash.com/photo-1582878826629-297527132b04?w=1200&q=80",
    description: "Phở bò tái lăn chuẩn vị Hà Nội với nước dùng béo ngậy, ngập tràn hành lá tươi ngon.",
    rating: 4.7,
    reviewCount: 980,
    commissionRate: 15,
    ownerId: 12,
    ownerName: "Nguyễn Văn Thìn",
    priceRange: "65.000đ - 90.000đ",
    deliveryTimeMinutes: 25,
    deliveryFee: 18000,
    openingHours: standardOpeningHours,
  },
  {
    id: 103,
    name: "Tokyo Sushi Omakase House",
    slug: "tokyo-sushi-house",
    address: "24 Lê Thánh Tôn, Bến Nghé, Quận 1, TP.HCM",
    latitude: 10.7788,
    longitude: 106.7025,
    phone: "028 3823 4567",
    email: "tokyosushi@eatzy.vn",
    category: {
      id: "3",
      name: "Sushi & Sashimi",
      slug: "sushi-sashimi",
    },
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=200&q=80",
    coverImageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&q=80",
    description: "Hương vị ẩm thực Nhật Bản đích thực với cá hồi Na Uy, cá ngừ vây xanh tươi sống nhập khẩu mỗi ngày.",
    rating: 4.9,
    reviewCount: 1650,
    commissionRate: 18,
    ownerId: 13,
    ownerName: "Kenji Sato",
    priceRange: "120.000đ - 450.000đ",
    deliveryTimeMinutes: 30,
    deliveryFee: 22000,
    openingHours: standardOpeningHours,
  },
  {
    id: 104,
    name: "Smokey Texas BBQ Grill",
    slug: "smokey-texas-bbq",
    address: "38 Xuân Thủy, Thảo Điền, TP. Thủ Đức, TP.HCM",
    latitude: 10.8042,
    longitude: 106.7329,
    phone: "028 3744 5566",
    email: "smokeybbq@eatzy.vn",
    category: {
      id: "4",
      name: "Barbecue & Đồ Nướng",
      slug: "barbecue",
    },
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&q=80",
    coverImageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80",
    description: "Sườn heo xông khói 12 tiếng mềm tan, sốt BBQ phong cách Texas hảo hạng.",
    rating: 4.8,
    reviewCount: 820,
    commissionRate: 15,
    ownerId: 14,
    ownerName: "David Miller",
    priceRange: "90.000đ - 350.000đ",
    deliveryTimeMinutes: 35,
    deliveryFee: 25000,
    openingHours: standardOpeningHours,
  },
  {
    id: 105,
    name: "La Bella Pasta & Pizza Studio",
    slug: "la-bella-pasta",
    address: "182 Pasteur, Bến Nghé, Quận 1, TP.HCM",
    latitude: 10.7811,
    longitude: 106.6979,
    phone: "028 3822 7890",
    email: "labella@eatzy.vn",
    category: {
      id: "6",
      name: "Pasta & Pizza",
      slug: "pasta",
    },
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=200&q=80",
    coverImageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=1200&q=80",
    description: "Pasta tươi làm tay trong ngày kết hợp sốt kem nấm truffle béo ngậy chuẩn phong vị Ý.",
    rating: 4.7,
    reviewCount: 640,
    commissionRate: 15,
    ownerId: 15,
    ownerName: "Marco Rossi",
    priceRange: "85.000đ - 220.000đ",
    deliveryTimeMinutes: 25,
    deliveryFee: 18000,
    openingHours: standardOpeningHours,
  },
  {
    id: 106,
    name: "Trà Sữa Phúc Long Tea & Coffee",
    slug: "phuc-long-tea-coffee",
    address: "325 Lý Tự Trọng, Bến Thành, Quận 1, TP.HCM",
    latitude: 10.7723,
    longitude: 106.6948,
    phone: "028 3825 8899",
    email: "phuclong@eatzy.vn",
    category: {
      id: "8",
      name: "Trà Sữa & Cà Phê",
      slug: "breakfast",
    },
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&q=80",
    coverImageUrl: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1200&q=80",
    description: "Đậm vị trà truyền thống Bảo Lộc, trà sữa thơm béo, trà đào trân châu giòn sần sật.",
    rating: 4.8,
    reviewCount: 3200,
    commissionRate: 12,
    ownerId: 16,
    ownerName: "Trương Lâm",
    priceRange: "35.000đ - 75.000đ",
    deliveryTimeMinutes: 15,
    deliveryFee: 15000,
    openingHours: standardOpeningHours,
  },
  {
    id: 107,
    name: "Ocean Pearl Seafood Bistro",
    slug: "ocean-pearl-seafood",
    address: "105 Tôn Dật Tiên, Tân Phong, Quận 7, TP.HCM",
    latitude: 10.7289,
    longitude: 106.7198,
    phone: "028 5410 2233",
    email: "oceanpearl@eatzy.vn",
    category: {
      id: "9",
      name: "Hải Sản Tươi Sống",
      slug: "fish-seafood",
    },
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=200&q=80",
    coverImageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80",
    description: "Hải sản tươi sống bơi tại hồ, tôm hùm sốt bơ tỏi, cua Cà Mau sốt me cay bùng nổ vị giác.",
    rating: 4.9,
    reviewCount: 1100,
    commissionRate: 16,
    ownerId: 17,
    ownerName: "Vũ Hải Đăng",
    priceRange: "150.000đ - 650.000đ",
    deliveryTimeMinutes: 30,
    deliveryFee: 24000,
    openingHours: standardOpeningHours,
  },
  {
    id: 108,
    name: "Burger Craft & Crispy Chicken",
    slug: "burger-craft-chicken",
    address: "68 Hàm Nghi, Bến Nghé, Quận 1, TP.HCM",
    latitude: 10.7715,
    longitude: 106.7041,
    phone: "028 3914 7788",
    email: "burgercraft@eatzy.vn",
    category: {
      id: "5",
      name: "Burger & Gà Rán",
      slug: "burger",
    },
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&q=80",
    coverImageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80",
    description: "Burger bò Wagyu đẫm phô mai Cheddar nướng chảy, gà giòn sốt cay mật ong thơm lừng.",
    rating: 4.6,
    reviewCount: 750,
    commissionRate: 15,
    ownerId: 18,
    ownerName: "Hoàng Minh Trí",
    priceRange: "55.000đ - 165.000đ",
    deliveryTimeMinutes: 20,
    deliveryFee: 16000,
    openingHours: standardOpeningHours,
  },
  {
    id: 109,
    name: "Sweet Dreams Patisserie & Gelato",
    slug: "sweet-dreams-patisserie",
    address: "42 Ngô Đức Kế, Bến Nghé, Quận 1, TP.HCM",
    latitude: 10.7741,
    longitude: 106.7049,
    phone: "028 3824 9911",
    email: "sweetdreams@eatzy.vn",
    category: {
      id: "7",
      name: "Bánh Ngọt & Tráng Miệng",
      slug: "desserts",
    },
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=200&q=80",
    coverImageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200&q=80",
    description: "Bánh croissant ngàn lớp giòn tan, tiramisu rượu rum thơm ngát và kem gelato Ý tự nhiên.",
    rating: 4.8,
    reviewCount: 890,
    commissionRate: 15,
    ownerId: 19,
    ownerName: "Lê Cẩm Tú",
    priceRange: "40.000đ - 120.000đ",
    deliveryTimeMinutes: 18,
    deliveryFee: 15000,
    openingHours: standardOpeningHours,
  },
  {
    id: 110,
    name: "Bún Chả Hà Nội Phố Cổ",
    slug: "bun-cha-ha-noi",
    address: "26C Lê Quý Đôn, Võ Thị Sáu, Quận 3, TP.HCM",
    latitude: 10.7818,
    longitude: 106.6912,
    phone: "028 3930 1122",
    email: "bunchahanoi@eatzy.vn",
    category: {
      id: "1",
      name: "Phở & Bún",
      slug: "pho-bun",
    },
    status: "OPEN",
    imageUrl: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80",
    coverImageUrl: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=1200&q=80",
    description: "Chả viên bọc lá xương xông nướng than hoa thơm nức, nước chấm chua ngọt đu đủ giòn rụm.",
    rating: 4.7,
    reviewCount: 670,
    commissionRate: 15,
    ownerId: 20,
    ownerName: "Phạm Văn Thành",
    priceRange: "50.000đ - 85.000đ",
    deliveryTimeMinutes: 22,
    deliveryFee: 16000,
    openingHours: standardOpeningHours,
  },
];

/**
 * Adapter to ModelRestaurant format (from @repo/models)
 */
export function toModelRestaurant(r: MockFullRestaurant): ModelRestaurant {
  return {
    id: String(r.id),
    name: r.name,
    address: r.address,
    latitude: r.latitude,
    longitude: r.longitude,
    contactPhone: r.phone,
    category: {
      id: r.category.id,
      name: r.category.name,
      slug: r.category.slug,
    },
    status: ModelRestaurantStatus.ACTIVE,
    imageUrl: r.imageUrl,
    description: r.description,
    rating: r.rating,
  };
}

/**
 * Adapter to TypeRestaurant format (from @repo/types)
 */
export function toTypeRestaurant(r: MockFullRestaurant): TypeRestaurant {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    address: r.address,
    latitude: r.latitude,
    longitude: r.longitude,
    contactPhone: r.phone,
    rating: r.rating,
    reviewCount: r.reviewCount,
    status: r.status,
    imageUrl: r.imageUrl,
    coverImageUrl: r.coverImageUrl,
    avatarUrl: r.avatarUrl,
    description: r.description,
    commissionRate: r.commissionRate,
    owner: {
      id: r.ownerId,
      name: r.ownerName,
      isActive: true,
    },
    restaurantTypes: {
      id: Number(r.category.id),
      name: r.category.name,
    },
    categories: [
      {
        id: r.category.id,
        name: r.category.name,
        slug: r.category.slug,
      },
    ],
  };
}

/**
 * Adapter to RestaurantDetail format (from @repo/types)
 */
export function toRestaurantDetail(r: MockFullRestaurant): RestaurantDetail {
  return {
    id: String(r.id),
    name: r.name,
    slug: r.slug,
    address: r.address,
    latitude: r.latitude,
    longitude: r.longitude,
    contactPhone: r.phone,
    rating: r.rating,
    reviewCount: r.reviewCount,
    status: r.status,
    coverImageUrl: r.coverImageUrl,
    avatarUrl: r.avatarUrl,
    description: r.description,
    oneStarCount: 5,
    twoStarCount: 12,
    threeStarCount: 45,
    fourStarCount: 180,
    fiveStarCount: r.reviewCount - 242,
  };
}

/**
 * Adapter matching BackendRestaurantDetailDTO expected by restaurant.mapper.ts
 */
export function toBackendRestaurantDetailDTO(r: MockFullRestaurant) {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    address: r.address,
    description: r.description,
    latitude: r.latitude,
    longitude: r.longitude,
    contactPhone: r.phone,
    status: r.status,
    commissionRate: r.commissionRate,
    oneStarCount: 5,
    twoStarCount: 12,
    threeStarCount: 45,
    fourStarCount: 180,
    fiveStarCount: Math.max(0, r.reviewCount - 242),
    averageRating: r.rating,
    schedule: JSON.stringify(r.openingHours),
    distance: 1.8,
    avatarUrl: r.avatarUrl,
    coverImageUrl: r.coverImageUrl,
    owner: {
      id: r.ownerId,
      name: r.ownerName,
    },
    restaurantTypes: {
      id: Number(r.category.id),
      name: r.category.name,
    },
  };
}

/**
 * Adapter matching BackendRestaurantMenuDTO expected by restaurant.mapper.ts
 */
export function toBackendRestaurantMenuDTO(
  restaurantId: number | string,
  restaurantName: string,
  dishes: Dish[],
  categories: MenuCategory[]
) {
  const restDishes = dishes.filter((d) => String(d.restaurantId) === String(restaurantId));
  const restCats = categories.filter((c) => String(c.restaurantId) === String(restaurantId));

  const activeDishes = restDishes.length > 0 ? restDishes : dishes.filter((d) => d.restaurantId === "101");
  const activeCats = restCats.length > 0 ? restCats : categories.filter((c) => c.restaurantId === "101");

  return {
    id: Number(restaurantId) || 101,
    name: restaurantName,
    dishes: activeCats.map((cat, catIdx) => {
      const numericCatId = Number(String(cat.id).replace(/\D/g, "")) || (catIdx + 1);
      return {
        id: numericCatId,
        name: cat.name,
        dishes: activeDishes
          .filter((d) => d.menuCategoryId === cat.id || d.menuCategoryId === String(numericCatId))
          .map((dish) => ({
            id: Number(dish.id.replace(/\D/g, "")) || 100,
            name: dish.name,
            description: dish.description || "",
            price: dish.price,
            availabilityQuantity: 99,
            imageUrl: dish.imageUrl || "",
            menuOptionGroupCount: dish.optionGroups?.length || 0,
            menuOptionGroups: (dish.optionGroups || []).map((og, ogIdx) => ({
              id: Number(og.id.replace(/\D/g, "")) || ogIdx + 1,
              name: og.title,
              minChoices: og.minSelect || 0,
              maxChoices: og.maxSelect || 1,
              menuOptions: (og.options || []).map((opt, optIdx) => ({
                id: Number(opt.id.replace(/\D/g, "")) || optIdx + 1,
                name: opt.name,
                priceAdjustment: opt.price,
                isAvailable: true,
              })),
            })),
          })),
      };
    }),
  };
}

