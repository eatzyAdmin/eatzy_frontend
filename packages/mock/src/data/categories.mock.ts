import type { RestaurantCategory } from "@repo/models";

export interface ExtendedCategory extends RestaurantCategory {
  imageUrl?: string;
  backgroundImage?: string;
  itemCount?: number;
}

export const MOCK_CATEGORIES: ExtendedCategory[] = [
  {
    id: "1",
    name: "Phở & Bún",
    slug: "pho-bun",
    description: "Món nước truyền thống, nước dùng thanh ngọt thơm lừng",
    imageUrl: "https://images.unsplash.com/photo-1582878826629-297527132b04?w=500&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1582878826629-297527132b04?w=1920&q=80",
    itemCount: 42,
  },
  {
    id: "2",
    name: "Cơm Tấm & Món Việt",
    slug: "com-tam",
    description: "Hạt cơm tấm thơm ngon, sườn bì chả nướng than hoa",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1920&q=80",
    itemCount: 56,
  },
  {
    id: "3",
    name: "Sushi & Sashimi",
    slug: "sushi-sashimi",
    description: "Hải sản tươi sống nhập khẩu, nghệ thuật ẩm thực Nhật Bản",
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=1920&q=80",
    itemCount: 38,
  },
  {
    id: "4",
    name: "Barbecue & Đồ Nướng",
    slug: "barbecue",
    description: "Thịt nướng xèo xèo sốt ướp đậm đà, chuẩn vị BBQ",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=1920&q=80",
    itemCount: 29,
  },
  {
    id: "5",
    name: "Burger & Gà Rán",
    slug: "burger",
    description: "Bánh kẹp giòn thơm, gà rán ráo dầu đậm vị sốt",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1920&q=80",
    itemCount: 35,
  },
  {
    id: "6",
    name: "Pasta & Pizza",
    slug: "pasta",
    description: "Mì Ý thủ công sốt kem béo ngậy, pizza phô mai kéo sợi",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1920&q=80",
    itemCount: 27,
  },
  {
    id: "7",
    name: "Bánh Ngọt & Tráng Miệng",
    slug: "desserts",
    description: "Bánh ngọt thủ công, kem gelato mát lạnh xua tan nắng nóng",
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1920&q=80",
    itemCount: 31,
  },
  {
    id: "8",
    name: "Trà Sữa & Cà Phê",
    slug: "breakfast",
    description: "Cà phê pha phin đậm đà, trà sữa trân châu dẻo bùi",
    imageUrl: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1920&q=80",
    itemCount: 64,
  },
  {
    id: "9",
    name: "Hải Sản Tươi Sống",
    slug: "fish-seafood",
    description: "Tôm, cua, cá tươi ngon chế biến ngay tại chỗ",
    imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80",
    backgroundImage: "https://images.unsplash.com/photo-1535473895227-bdecb20fb157?w=1920&q=80",
    itemCount: 48,
  },
];

export const getCategoryBackground = (slug: string): string => {
  const match = MOCK_CATEGORIES.find((c) => c.slug === slug);
  return match?.backgroundImage || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80";
};
