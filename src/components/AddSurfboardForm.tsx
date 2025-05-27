import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSurfboards } from '@/contexts/SurfboardContext';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './auth/AuthModal';

const BOARD_TYPES = [
  'Shortboard',
  'Longboard',
  'Fish',
  'Funboard',
  'Hybrid',
  'Gun',
  'Foam',
  'SUP',
  'Other'
];

export function AddSurfboardForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_per_day: '',
    image_url: '',
    location: '',
    board_type: '',
    length: '',
    width: '',
    thickness: '',
    volume: '',
  });
  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { addSurfboard } = useSurfboards();
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    
    setLoading(true);
    try {
      await addSurfboard({
        title: formData.title,
        description: formData.description,
        price_per_day: parseFloat(formData.price_per_day) || 0,
        image_url: formData.image_url || undefined,
        location: formData.location,
        board_type: formData.board_type,
        length: formData.length ? parseFloat(formData.length) : undefined,
        width: formData.width ? parseFloat(formData.width) : undefined,
        thickness: formData.thickness ? parseFloat(formData.thickness) : undefined,
        volume: formData.volume ? parseFloat(formData.volume) : undefined,
        available: true,
      });
      
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        price_per_day: '',
        image_url: '',
        location: '',
        board_type: '',
        length: '',
        width: '',
        thickness: '',
        volume: '',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="9'6 Longboard in great condition"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price_per_day">Price per day ($)</Label>
            <Input
              id="price_per_day"
              name="price_per_day"
              type="number"
              step="0.01"
              min="0"
              value={formData.price_per_day}
              onChange={handleChange}
              placeholder="25.00"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Santa Monica, CA"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/surfboard.jpg"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="board_type">Board Type</Label>
            <Select
              value={formData.board_type}
              onValueChange={(value) => handleSelectChange('board_type', value)}
            >
              <SelectTrigger id="board_type">
                <SelectValue placeholder="Select board type" />
              </SelectTrigger>
              <SelectContent>
                {BOARD_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="length">Length (inches)</Label>
            <Input
              id="length"
              name="length"
              type="number"
              step="0.1"
              min="0"
              value={formData.length}
              onChange={handleChange}
              placeholder="72"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your surfboard..."
            rows={3}
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Adding Surfboard...' : 'List Your Surfboard'}
        </Button>
      </form>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
