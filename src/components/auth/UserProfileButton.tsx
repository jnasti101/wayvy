import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AuthModal } from './AuthModal';
import { UserProfileModal } from './UserProfileModal';
import { useToast } from '@/hooks/use-toast';

export function UserProfileButton() {
  const { user, loading, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out"
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: "There was a problem signing you out",
        variant: "destructive"
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <span className="h-6 w-6 animate-pulse rounded-full bg-muted"></span>
      </Button>
    );
  }

  // User is not logged in
  if (!user) {
    return (
      <>
        <Button onClick={() => setAuthModalOpen(true)}>
          Sign In
        </Button>
        <AuthModal 
          isOpen={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
        />
      </>
    );
  }

  // User is logged in
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage src={user.avatar_url || ''} alt={user.full_name || 'User'} />
              <AvatarFallback>
                {(user.full_name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {user.full_name || user.email || 'My Account'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setProfileModalOpen(true)}>
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            My Surfboards
          </DropdownMenuItem>
          <DropdownMenuItem>
            My Rentals
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleSignOut}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserProfileModal 
        isOpen={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
      />
    </>
  );
}
