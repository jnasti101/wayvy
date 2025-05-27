import { Surfboard, Rental } from '@/types/surfboard';
import { v4 as uuidv4 } from 'uuid';

// Mock user IDs
const userIds = {
  user1: uuidv4(),
  user2: uuidv4(),
  user3: uuidv4(),
};

// Mock surfboards data
export const mockSurfboards: Surfboard[] = [
  {
    id: uuidv4(),
    title: 'Beginner Friendly Foam Board',
    description: 'Perfect for beginners, soft top foam board, very stable and buoyant.',
    price: 25,
    location: 'Santa Monica, CA',
    imageUrl: 'https://images.unsplash.com/photo-1531722569936-825d3dd91b15?q=80&w=1470&auto=format&fit=crop',
    ownerId: userIds.user1,
    ownerName: 'Mike Johnson',
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Performance Shortboard',
    description: 'High-performance shortboard for experienced surfers. Great for tight turns and barrels.',
    price: 40,
    location: 'Huntington Beach, CA',
    imageUrl: 'https://images.unsplash.com/photo-1501520158826-76df880863a3?q=80&w=1470&auto=format&fit=crop',
    ownerId: userIds.user2,
    ownerName: 'Sarah Wilson',
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Longboard for Cruising',
    description: 'Classic 9ft longboard, perfect for small waves and cruising.',
    price: 35,
    location: 'Malibu, CA',
    imageUrl: 'https://images.unsplash.com/photo-1455264745730-cb3b76250ae8?q=80&w=1544&auto=format&fit=crop',
    ownerId: userIds.user3,
    ownerName: 'Tom Davis',
    available: true,
    createdAt: new Date().toISOString(),
  },
];

// Mock rentals data
export const mockRentals: Rental[] = [
  {
    id: uuidv4(),
    surfboardId: mockSurfboards[0].id,
    renterId: userIds.user2,
    renterName: 'Sarah Wilson',
    period: {
      startDate: '2023-08-01',
      endDate: '2023-08-03',
    },
    totalPrice: 75,
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
];
