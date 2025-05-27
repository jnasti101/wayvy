import { useState, useEffect } from 'react';
import { Surfboard } from '@/types/surfboard';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AllSurfboardsAdmin() {
  const [allSurfboards, setAllSurfboards] = useState<Surfboard[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllSurfboards();
  }, []);

  const fetchAllSurfboards = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('surfboards')
        .select('*');

      if (error) throw error;
      setAllSurfboards(data || []);
    } catch (error: any) {
      console.error('Error fetching all surfboards:', error);
      toast({
        title: 'Error',
        description: 'Failed to load surfboards',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSurfboard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('surfboards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAllSurfboards(prev => prev.filter(board => board.id !== id));
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
        <h2 className="text-2xl font-bold">All Surfboards</h2>
        <Button onClick={fetchAllSurfboards} variant="outline" disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      <div className="space-y-4">
        {allSurfboards.length === 0 ? (
          <p className="text-muted-foreground">No surfboards found</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allSurfboards.map((board) => (
              <Card key={board.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{board.title}</span>
                    <Badge variant={board.is_approved ? "success" : "secondary"}>
                      {board.is_approved ? "Approved" : "Pending"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{board.description}</p>
                  <div className="text-sm">
                    <p><span className="font-medium">Type:</span> {board.board_type}</p>
                    <p><span className="font-medium">Location:</span> {board.location}</p>
                    <p><span className="font-medium">Price:</span> ${board.price_per_day}/day</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="destructive" onClick={() => deleteSurfboard(board.id)}>Remove Listing</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
