import React from 'react';
import { Surfboard } from '@/types/surfboard';
import { SurfboardCard } from './SurfboardCard';

interface SurfboardListProps {
  surfboards: Surfboard[];
  isOwner?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}

export const SurfboardList: React.FC<SurfboardListProps> = ({ 
  surfboards, 
  isOwner = false,
  loading = false,
  emptyMessage = "No surfboards available"
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading surfboards...</p>
      </div>
    );
  }

  if (surfboards.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-medium">{emptyMessage}</h3>
        <p className="text-muted-foreground mt-2">
          {isOwner ? "List a board to get started!" : "Check back later for new listings."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {surfboards.map((surfboard) => (
        <SurfboardCard 
          key={surfboard.id} 
          surfboard={surfboard} 
          isOwner={isOwner}
        />
      ))}
    </div>
  );
};

export default SurfboardList;
