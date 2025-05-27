import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MessageSystem } from '@/components/MessageSystem';
import { Rental } from '@/types/surfboard';
import { format } from 'date-fns';
import { useSurfboards } from '@/contexts/SurfboardContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface RentalDetailsModalProps {
  rental: Rental;
  isOpen: boolean;
  onClose: () => void;
  isOwner: boolean;
}

export function RentalDetailsModal({ rental, isOpen, onClose, isOwner }: RentalDetailsModalProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const { updateSurfboard } = useSurfboards();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'success';
      case 'canceled': return 'destructive';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  const handleUpdateStatus = async (newStatus: 'confirmed' | 'canceled' | 'completed') => {
    if (!rental.surfboard || !user) return;
    
    setLoading(true);
    try {
      // Update rental status
      const { error } = await supabase
        .from('rentals')
        .update({ status: newStatus })
        .eq('id', rental.id);

      if (error) throw error;
      
      // If confirming or canceling, update the surfboard's has_requests flag
      if (newStatus === 'confirmed' || newStatus === 'canceled') {
        await updateSurfboard(rental.surfboard.id, { 
          has_requests: newStatus === 'confirmed' // Keep has_requests true if confirmed
        });
      }
      
      toast({
        title: `Rental ${newStatus}`,
        description: `The rental has been ${newStatus} successfully`,
      });
      
      onClose();
    } catch (error: any) {
      console.error('Error updating rental status:', error);
      toast({
        title: 'Error updating rental',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            Rental Details
            <Badge variant={getStatusBadgeVariant(rental.status)}>
              {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="flex-1 overflow-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img 
                  src={rental.surfboard?.image_url || '/placeholder.svg'} 
                  alt={rental.surfboard?.title || 'Surfboard'} 
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-medium text-lg">{rental.surfboard?.title}</h3>
                  <p className="text-muted-foreground">{rental.surfboard?.board_type}, {rental.surfboard?.location}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Rental Period</h4>
                  <p>{format(new Date(rental.start_date), 'PPP')} - {format(new Date(rental.end_date), 'PPP')}</p>
                </div>
                <div>
                  <h4 className="font-medium">Total Price</h4>
                  <p>${rental.total_price.toFixed(2)}</p>
                </div>
              </div>
              
              {rental.status === 'pending' && isOwner && (
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="success" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleUpdateStatus('confirmed')}
                    disabled={loading}
                  >
                    Confirm Rental
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => handleUpdateStatus('canceled')}
                    disabled={loading}
                  >
                    Decline
                  </Button>
                </div>
              )}
              
              {rental.status === 'confirmed' && (
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleUpdateStatus('completed')}
                    disabled={loading}
                  >
                    Mark as Completed
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="messages" className="flex-1 overflow-hidden">
            <div className="h-[500px] overflow-hidden">
              <MessageSystem 
                rentalId={rental.id} 
                ownerId={rental.surfboard?.owner_id || ''} 
                renterId={rental.renter_id} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
