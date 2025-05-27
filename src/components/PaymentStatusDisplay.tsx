import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Clock, CreditCard } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Payment {
  id: string;
  transaction_id: string;
  amount: number;
  service_fee: number;
  platform_fee: number;
  total_amount: number;
  status: string;
  created_at: string;
  rental: {
    id: string;
    surfboard: {
      title: string;
    };
    start_date: string;
    end_date: string;
  };
}

export function PaymentStatusDisplay() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchPayments();
    }
  }, [user?.id]);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          rental:rentals(
            id,
            start_date,
            end_date,
            surfboard:surfboards(
              title
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading payment history...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payment History</h2>
        <Button onClick={fetchPayments} variant="outline" size="sm">
          Refresh
        </Button>
      </div>
      
      {payments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No payment history found</p>
          </CardContent>
        </Card>
      ) : (
        payments.map((payment) => (
          <Card key={payment.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(payment.status)}
                  Payment for {payment.rental.surfboard.title}
                </CardTitle>
                <Badge className={getStatusColor(payment.status)}>
                  {payment.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Transaction ID:</p>
                  <p className="text-gray-600 font-mono">{payment.transaction_id}</p>
                </div>
                <div>
                  <p className="font-medium">Date:</p>
                  <p className="text-gray-600">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Rental Period:</p>
                  <p className="text-gray-600">
                    {new Date(payment.rental.start_date).toLocaleDateString()} - 
                    {new Date(payment.rental.end_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Amount Breakdown:</p>
                  <div className="text-gray-600">
                    <p>Rental: ${payment.amount.toFixed(2)}</p>
                    <p>Service Fee: ${payment.service_fee.toFixed(2)}</p>
                    <p>Platform Fee: ${payment.platform_fee.toFixed(2)}</p>
                    <p className="font-bold">Total: ${payment.total_amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}