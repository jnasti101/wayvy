import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, differenceInDays } from 'date-fns';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Surfboard } from '@/types/surfboard';
import { useSurfboards } from '@/contexts/SurfboardContext';
import { PaymentForm, PaymentData } from '@/components/PaymentForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RentSurfboardModalProps {
  surfboard: Surfboard;
  isOpen: boolean;
  onClose: () => void;
}

export function RentSurfboardModal({ surfboard, isOpen, onClose }: RentSurfboardModalProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 3));
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('dates');
  const { rentSurfboard } = useSurfboards();

  const calculateTotalDays = () => {
    if (!startDate || !endDate) return 0;
    return Math.max(1, differenceInDays(endDate, startDate));
  };

  const calculateTotalPrice = () => {
    const days = calculateTotalDays();
    return days * surfboard.price_per_day;
  };

  const handlePaymentSubmit = async (paymentData: PaymentData) => {
    if (!startDate || !endDate) return;
    
    setLoading(true);
    try {
      await rentSurfboard(
        surfboard.id,
        startDate.toISOString(),
        endDate.toISOString(),
        calculateTotalPrice(),
        paymentData
      );
      onClose();
      setCurrentTab('dates');
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToPayment = () => {
    if (startDate && endDate) {
      setCurrentTab('payment');
    }
  };

  const handleClose = () => {
    onClose();
    setCurrentTab('dates');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Rent {surfboard.title}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dates">Select Dates</TabsTrigger>
            <TabsTrigger value="payment" disabled={!startDate || !endDate}>
              Payment
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dates" className="space-y-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => startDate ? date <= startDate : date <= new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Price per day:</span>
                <span>${surfboard.price_per_day.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Number of days:</span>
                <span>{calculateTotalDays()}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Rental total:</span>
                <span>${calculateTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={handleClose} className="sm:w-auto w-full">
                Cancel
              </Button>
              <Button 
                onClick={handleContinueToPayment}
                className="sm:w-auto w-full" 
                disabled={!startDate || !endDate}
              >
                Continue to Payment
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="payment">
            <PaymentForm
              totalAmount={calculateTotalPrice()}
              onPaymentSubmit={handlePaymentSubmit}
              loading={loading}
            />
            
            <DialogFooter className="mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setCurrentTab('dates')}
                className="sm:w-auto w-full"
                disabled={loading}
              >
                Back to Dates
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}