import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { RentalDetailsModal } from './RentalDetailsModal';
import { Rental } from '@/types/surfboard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function OwnerRentalsView() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      fetchOwnerRentals();
    }
  }, [user?.id]);

  const fetchOwnerRentals = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Get all surfboards owned by the user
      const { data: userSurfboards, error: surfboardError } = await supabase
        .from('surfboards')
        .select('id')
        .eq('owner_id', user.id);

      if (surfboardError) throw surfboardError;
      if (!userSurfboards || userSurfboards.length === 0) {
        setRentals([]);
        setLoading(false);
        return;
      }

      // Get all rentals for those surfboards
      const surfboardIds = userSurfboards.map(sb => sb.id);
      const { data: rentalData, error: rentalError } = await supabase
        .from('rentals')
        .select(`
          *,
          surfboard:surfboards(*)
        `)
        .in('surfboard_id', surfboardIds)
        .order('created_at', { ascending: false });

      if (rentalError) throw rentalError;
      setRentals(rentalData || []);
    } catch (error: any) {
      console.error('Error fetching owner rentals:', error);
      toast({
        title: 'Error loading rentals',
        description: error.message || 'Failed to load rental requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading rental requests...</p>
      </div>
    );
  }

  if (rentals.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-medium">No rental requests</h3>
        <p className="text-muted-foreground mt-2">
          You don't have any rental requests for your surfboards yet.
        </p>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'success';
      case 'canceled': return 'destructive';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rentals.map((rental) => (
          <Card key={rental.id} className="overflow-hidden">
            <div className="aspect-video relative overflow-hidden">
              <img
                src={rental.surfboard?.image_url || '/placeholder.svg'}
                alt={rental.surfboard?.title || 'Surfboard'}
                className="object-cover w-full h-full"
              />
              <Badge 
                variant={getStatusBadgeVariant(rental.status)}
                className="absolute top-2 right-2"
              >
                {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
              </Badge>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{rental.surfboard?.title}</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Dates:</span>{' '}
                  {format(new Date(rental.start_date), 'MMM d')} - {format(new Date(rental.end_date), 'MMM d, yyyy')}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Total:</span> ${rental.total_price.toFixed(2)}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => setSelectedRental(rental)}
                >
                  {rental.status === 'pending' ? 'Respond to Request' : 'View Details'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedRental && (
        <RentalDetailsModal
          rental={selectedRental}
          isOpen={!!selectedRental}
          onClose={() => {
            setSelectedRental(null);
            fetchOwnerRentals(); // Refresh data when modal closes
          }}
          isOwner={true}
        />
      )}
    </>
  );
}
