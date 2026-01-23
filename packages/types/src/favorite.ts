// Matches backend Favorite and ResFavouriteDTO
export interface FavoriteRequest {
  customer: { id: number };
  restaurant: { id: number };
}

export interface FavoriteResponse {
  id: number;
  customer: {
    id: number;
    name: string;
  };
  restaurant: {
    id: number;
    name: string;
    address: string;
    description: string;
    averageRating: number;
    slug?: string;
    avatarUrl?: string;
  };
}

