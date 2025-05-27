import { useState, useEffect } from 'react';
import { Surfboard } from '@/types/surfboard';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AdminPanel() {
  const [pendingSurfboards, setPendingSurfboards] = useState<Surfboard[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingSurfboards();
  }, []);

  const fetchPendingSurfboards = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('surfboards')
        .select('*')
        .eq('is_approved', false);

      if (error) throw error;
      setPendingSurfboards(data || []);
    } catch (error: any) {
      console.error('Error fetching pending surfboards:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pending surfboards',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const approveSurfboard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('surfboards')
        .update({ is_approved: true })
        .eq('id', id);

      if (error) throw error;

      setPendingSurfboards(prev => prev.filter(board => board.id !== id));
      toast({
        title: 'Success',
        description: 'Surfboard approved successfully',
      });
    } catch (error: any) {
      console.error('Error approving surfboard:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve surfboard',
        variant: 'destructive',
      });
    }
  };

  const deleteSurfboard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('surfboards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPendingSurfboards(prev => prev.filter(board => board.id !== id));
      toast({
        title: 'Success',
        description: 'Surfboard removed successfully',
      });
    } catch (error: any) {
      console.error('Error removing surfboard:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove surfboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <Button onClick={fetchPendingSurfboards} variant="outline" disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Pending Approvals ({pendingSurfboards.length})</h3>
        {pendingSurfboards.length === 0 ? (
          <p className="text-muted-foreground">No surfboards pending approval</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingSurfboards.map((board) => (
              <Card key={board.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{board.title}</span>
                    <Badge variant="outline">${board.price_per_day}/day</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{board.description}</p>
                  <div className="text-sm">
                    <p><span className="font-medium">Type:</span> {board.board_type}</p>
                    <p><span className="font-medium">Location:</span> {board.location}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => deleteSurfboard(board.id)}>Remove</Button>
                  <Button onClick={() => approveSurfboard(board.id)}>Approve</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
