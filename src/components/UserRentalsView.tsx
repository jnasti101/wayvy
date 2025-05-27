import { useState } from 'react';
import { useSurfboards } from '@/contexts/SurfboardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { RentalDetailsModal } from './RentalDetailsModal';
import { PaymentStatusDisplay } from './PaymentStatusDisplay';
import { PaymentInfoModal } from './PaymentInfoModal';
import { Rental } from '@/types/surfboard';
import { Info } from 'lucide-react';

export function UserRentalsView() {
  const { userRentals, loading } = useSurfboards();
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading your rentals...</p>
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">My Rentals</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowPaymentInfo(true)}
            className="flex items-center gap-2"
          >
            <Info className="h-4 w-4" />
            Payment Info
          </Button>
        </div>

        <Tabs defaultValue="rentals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="rentals">My Rentals</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="rentals">
            {userRentals.length === 0 ? (
              <div className="text-center p-8 bg-muted/50 rounded-lg">
                <h3 className="text-lg font-medium">No rentals yet</h3>
                <p className="text-muted-foreground mt-2">
                  You haven't rented any surfboards yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userRentals.map((rental) => (
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
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="payments">
            <PaymentStatusDisplay />
          </TabsContent>
        </Tabs>
      </div>

      {selectedRental && (
        <RentalDetailsModal
          rental={selectedRental}
          isOpen={!!selectedRental}
          onClose={() => setSelectedRental(null)}
          isOwner={false}
        />
      )}

      <PaymentInfoModal 
        open={showPaymentInfo}
        onOpenChange={setShowPaymentInfo}
      />
    </>
  );
}