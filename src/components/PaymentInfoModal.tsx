import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, DollarSign } from 'lucide-react';

interface PaymentInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentInfoModal({ open, onOpenChange }: PaymentInfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Payment Information & Money Flow
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Demo Payment System</h3>
                  <p className="text-sm text-gray-600">
                    This is a <strong>demonstration payment system</strong>. No real money is being charged to your card. 
                    The payment processing is simulated for testing purposes only.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold">Fee Structure</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service Fee:</span>
                    <span>2.9% + $0.30</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee:</span>
                    <span>5%</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Service fees simulate payment processor costs (like Stripe)
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">Simulated</Badge>
                  <h3 className="font-semibold">Money Flow</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>1.</strong> Payment processed (simulated)</p>
                  <p><strong>2.</strong> Transaction ID generated</p>
                  <p><strong>3.</strong> Record stored in database</p>
                  <p><strong>4.</strong> Rental confirmed</p>
                  <div className="text-xs text-gray-500 mt-2">
                    In production, money would go to the surfboard owner minus platform fees
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">How to Verify Payments</h3>
              <div className="space-y-2 text-sm">
                <p><strong>1. Transaction ID:</strong> Each payment gets a unique transaction ID (txn_timestamp_random)</p>
                <p><strong>2. Payment History:</strong> View all your payments in the "My Rentals" section</p>
                <p><strong>3. Database Records:</strong> All payment details are stored in the payments table</p>
                <p><strong>4. Status Tracking:</strong> Payments show as "completed" when successful</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-blue-800 mb-2">For Production Use</h3>
              <p className="text-sm text-blue-700">
                To process real payments, integrate with payment providers like Stripe, PayPal, or Square. 
                The current system provides the foundation for real payment processing.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}