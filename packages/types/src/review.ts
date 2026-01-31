// Review types

export interface ReviewDTO {
  id: number;
  order: {
    id: number;
  };
  customer: {
    id: number;
    name: string;
  };
  reviewTarget: 'restaurant' | 'driver';
  targetName: string;
  rating: number;
  comment: string;
  reply: string | null;
  createdAt: string;
}

export interface ReviewReplyRequest {
  id: number;
  reply: string;
}

// Display format for UI (renamed to avoid conflict with restaurant.Review)
export interface ReviewDisplayItem {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  date: string;
  content: string;
  reply?: string | null;
}
