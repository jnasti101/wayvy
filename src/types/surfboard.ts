export interface Surfboard {
  id: string;
  title: string;
  description: string;
  price_per_day: number;
  image_url?: string;
  location: string;
  board_type: string;
  length?: number;
  width?: number;
  thickness?: number;
  volume?: number;
  available: boolean;
  has_requests?: boolean; // New field to track if board has pending rental requests
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Rental {
  id: string;
  surfboard_id: string;
  renter_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed';
  created_at?: string;
  updated_at?: string;
  surfboard?: Surfboard;
}

export interface Message {
  id: string;
  rental_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}
