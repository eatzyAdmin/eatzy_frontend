// Matches backend Favorite and ResFavouriteDTO
export interface FavoriteRequest {
  customer?: { id: number };  // Optional - backend uses auth context if not provided
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
    imageUrl?: string; // Backend returns this from avatarUrl
    avatarUrl?: string;
    coverImageUrl?: string;
  };
}

