import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <div className="text-center mb-16">
      <h1 className="text-5xl font-bold text-primary mb-4">Wave Riders Surfboard Rentals</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        Your one-stop destination for premium surfboard rentals from local surfers
      </p>
      <Link to="/boards">
        <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
          Browse Surfboards
        </Button>
      </Link>
    </div>
  );
};

export default HeroSection;
