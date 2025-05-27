import { createContext, useContext, useState, useEffect } from 'react';
import { Surfboard, Rental } from '@/types/surfboard';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { PaymentData } from '@/components/PaymentForm';

interface SurfboardContextType {
  surfboards: Surfboard[];
  userSurfboards: Surfboard[];
  userRentals: Rental[];
  loading: boolean;
  addSurfboard: (surfboard: Omit<Surfboard, 'id' | 'owner_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateSurfboard: (id: string, surfboard: Partial<Surfboard>) => Promise<void>;
  deleteSurfboard: (id: string) => Promise<void>;
  rentSurfboard: (surfboardId: string, startDate: string, endDate: string, totalPrice: number, paymentData: PaymentData) => Promise<void>;
  fetchSurfboards: () => Promise<void>;
}

const SurfboardContext = createContext<SurfboardContextType | undefined>(undefined);

export function SurfboardProvider({ children }: { children: React.ReactNode }) {
  const [surfboards, setSurfboards] = useState<Surfboard[]>([]);
  const [userSurfboards, setUserSurfboards] = useState<Surfboard[]>([]);
  const [userRentals, setUserRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchSurfboards();
  }, [user?.id]);

  const fetchSurfboards = async () => {
    setLoading(true);
    try {
      const { data: allSurfboards, error } = await supabase
        .from('surfboards')
        .select('*')
        .eq('available', true);

      if (error) throw error;
      setSurfboards(allSurfboards || []);

      if (user?.id) {
        const { data: ownedSurfboards, error: ownedError } = await supabase
          .from('surfboards')
          .select('*')
          .eq('owner_id', user.id);

        if (ownedError) throw ownedError;
        setUserSurfboards(ownedSurfboards || []);

        const { data: rentals, error: rentalsError } = await supabase
          .from('rentals')
          .select(`
            *,
            surfboard:surfboards(*)
          `)
          .eq('renter_id', user.id);

        if (rentalsError) throw rentalsError;
        setUserRentals(rentals || []);
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error fetching data',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addSurfboard = async (surfboard: Omit<Surfboard, 'id' | 'owner_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to add a surfboard',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('surfboards')
        .insert([{ ...surfboard, owner_id: user.id, has_requests: false }])
        .select()
        .single();

      if (error) throw error;

      setSurfboards(prev => [...prev, data]);
      setUserSurfboards(prev => [...prev, data]);

      toast({
        title: 'Surfboard added',
        description: 'Your surfboard has been listed successfully',
      });
    } catch (error: any) {
      console.error('Error adding surfboard:', error);
      toast({
        title: 'Error adding surfboard',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  const updateSurfboard = async (id: string, surfboard: Partial<Surfboard>) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('surfboards')
        .update(surfboard)
        .eq('id', id)
        .eq('owner_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setSurfboards(prev => prev.map(s => s.id === id ? data : s));
      setUserSurfboards(prev => prev.map(s => s.id === id ? data : s));

      toast({
        title: 'Surfboard updated',
        description: 'Your surfboard has been updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating surfboard:', error);
      toast({
        title: 'Error updating surfboard',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  const deleteSurfboard = async (id: string) => {
    if (!user?.id) return;

    try {
      const { data: surfboard, error: checkError } = await supabase
        .from('surfboards')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user.id)
        .single();

      if (checkError) throw checkError;
      if (!surfboard) throw new Error('Surfboard not found or you do not have permission to delete it');

      const { error } = await supabase
        .from('surfboards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSurfboards(prev => prev.filter(s => s.id !== id));
      setUserSurfboards(prev => prev.filter(s => s.id !== id));

      toast({
        title: 'Surfboard removed',
        description: 'Your surfboard has been removed successfully',
      });
    } catch (error: any) {
      console.error('Error deleting surfboard:', error);
      toast({
        title: 'Error removing surfboard',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const rentSurfboard = async (surfboardId: string, startDate: string, endDate: string, totalPrice: number, paymentData: PaymentData) => {
    if (!user?.id) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to rent a surfboard',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Process payment first
      const paymentResponse = await fetch(
        'https://kynwqwvmbvthbekukfaq.supabase.co/functions/v1/2fc5e0de-9876-4edb-be09-968d1c92581e',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({
            amount: totalPrice,
            paymentData,
            surfboardId,
            startDate,
            endDate
          })
        }
      );

      if (!paymentResponse.ok) {
        throw new Error(`Payment request failed: ${paymentResponse.status}`);
      }

      const paymentResult = await paymentResponse.json();
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.message || 'Payment failed');
      }

      // Create rental record
      const { data: rental, error: rentalError } = await supabase
        .from('rentals')
        .insert([{
          surfboard_id: surfboardId,
          renter_id: user.id,
          start_date: startDate,
          end_date: endDate,
          total_price: totalPrice,
          status: 'confirmed'
        }])
        .select(`
          *,
          surfboard:surfboards(*)
        `)
        .single();

      if (rentalError) throw rentalError;

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([{
          rental_id: rental.id,
          user_id: user.id,
          transaction_id: paymentResult.payment.transactionId,
          amount: paymentResult.payment.originalAmount,
          service_fee: paymentResult.payment.serviceFee,
          platform_fee: paymentResult.payment.platformFee,
          total_amount: paymentResult.payment.amount,
          status: 'completed'
        }]);

      if (paymentError) throw paymentError;

      // Update surfboard to show it has requests
      await supabase
        .from('surfboards')
        .update({ has_requests: true })
        .eq('id', surfboardId);

      setUserRentals(prev => [...prev, rental]);

      toast({
        title: 'Payment successful!',
        description: 'Your rental has been confirmed and payment processed.',
      });
    } catch (error: any) {
      console.error('Error processing rental:', error);
      toast({
        title: 'Payment failed',
        description: error.message || 'Something went wrong with your payment',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <SurfboardContext.Provider
      value={{
        surfboards,
        userSurfboards,
        userRentals,
        loading,
        addSurfboard,
        updateSurfboard,
        deleteSurfboard,
        rentSurfboard,
        fetchSurfboards,
      }}
    >
      {children}
    </SurfboardContext.Provider>
  );
}

export const useSurfboards = () => {
  const context = useContext(SurfboardContext);
  if (context === undefined) {
    throw new Error('useSurfboards must be used within a SurfboardProvider');
  }
  return context;
};