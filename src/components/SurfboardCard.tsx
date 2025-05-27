import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Surfboard } from '@/types/surfboard';
import { RentSurfboardModal } from './RentSurfboardModal';
import { useAuth } from '@/contexts/AuthContext';
import { useSurfboards } from '@/contexts/SurfboardContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

interface SurfboardCardProps {
  surfboard: Surfboard;
  isOwner?: boolean;
}

export function SurfboardCard({ surfboard, isOwner = false }: SurfboardCardProps) {
  const [showRentModal, setShowRentModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user } = useAuth();
  const { deleteSurfboard } = useSurfboards();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSurfboard(surfboard.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting surfboard:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden h-full flex flex-col shadow-md hover:shadow-lg transition-shadow duration-200">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={surfboard.image_url || '/placeholder.svg'}
            alt={surfboard.title}
            className="object-cover w-full h-full"
          />
          {surfboard.has_requests && (
            <Badge className="absolute top-2 right-2 bg-amber-500">
              Has Requests
            </Badge>
          )}
        </div>
        
        <CardHeader className="pb-2 bg-gradient-to-r from-accent to-secondary/50">
          <CardTitle className="text-lg">{surfboard.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="pb-2 flex-grow">
          <div className="flex justify-between mb-2">
            <span className="font-bold text-lg text-primary">${surfboard.price_per_day}/day</span>
            <span className="text-sm text-muted-foreground">{surfboard.location}</span>
          </div>
          
          <div className="text-sm text-muted-foreground mb-2">
            {surfboard.board_type}
            {surfboard.length && `, ${surfboard.length}ft`}
          </div>
          
          <p className="text-sm line-clamp-2">{surfboard.description}</p>
        </CardContent>
        
        <CardFooter className="bg-gradient-to-r from-secondary/30 to-accent/30">
          {isOwner ? (
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Removing...' : 'Remove Listing'}
            </Button>
          ) : (
            <Button 
              className="w-full" 
              onClick={() => setShowRentModal(true)}
              disabled={!user}
            >
              {user ? 'Rent This Board' : 'Sign In to Rent'}
            </Button>
          )}
        </CardFooter>
      </Card>

      {showRentModal && (
        <RentSurfboardModal
          surfboard={surfboard}
          isOpen={showRentModal}
          onClose={() => setShowRentModal(false)}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove your surfboard listing. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Removing...' : 'Remove Listing'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
