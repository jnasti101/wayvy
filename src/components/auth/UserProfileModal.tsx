import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/types/user';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    full_name: '',
    avatar_url: '',
    phone: '',
    bio: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        full_name: user.full_name || '',
        avatar_url: user.avatar_url || '',
        phone: user.phone || '',
        bio: user.bio || '',
        location: user.location || '',
      });
    }
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await updateProfile(formData);
      if (error) throw error;
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={formData.avatar_url || ''} alt={formData.full_name || 'User'} />
              <AvatarFallback className="text-2xl">
                {(formData.full_name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="avatar_url">Profile Picture URL</Label>
            <Input
              id="avatar_url"
              name="avatar_url"
              value={formData.avatar_url || ''}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name || ''}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              placeholder="San Diego, CA"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio || ''}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
