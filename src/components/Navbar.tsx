import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserProfileButton } from './auth/UserProfileButton';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-primary">Wave Riders</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant={location.pathname === '/' ? 'default' : 'ghost'}>Home</Button>
          </Link>
          <Link to="/boards">
            <Button variant={location.pathname === '/boards' ? 'default' : 'ghost'}>Browse Boards</Button>
          </Link>
          <UserProfileButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
