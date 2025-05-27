import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Lock } from 'lucide-react';

interface PaymentFormProps {
  totalAmount: number;
  onPaymentSubmit: (paymentData: PaymentData) => Promise<void>;
  loading: boolean;
}

export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export function PaymentForm({ totalAmount, onPaymentSubmit, loading }: PaymentFormProps) {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const serviceFee = totalAmount * 0.029 + 0.30; // 2.9% + $0.30
  const platformFee = totalAmount * 0.05; // 5% platform fee
  const finalTotal = totalAmount + serviceFee + platformFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onPaymentSubmit(paymentData);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Rental amount:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service fee (2.9% + $0.30):</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Platform fee (5%):</span>
              <span>${platformFee.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={paymentData.cardholderName}
                onChange={(e) => setPaymentData(prev => ({ ...prev, cardholderName: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  setPaymentData(prev => ({ ...prev, cardNumber: formatted }));
                }}
                maxLength={19}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={(e) => {
                    const formatted = formatExpiry(e.target.value);
                    setPaymentData(prev => ({ ...prev, expiryDate: formatted }));
                  }}
                  maxLength={5}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setPaymentData(prev => ({ ...prev, cvv: value }));
                  }}
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing Payment...' : `Pay $${finalTotal.toFixed(2)}`}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}