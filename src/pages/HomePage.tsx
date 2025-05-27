import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-cyan-100">
      <Navbar />
      <div className="container mx-auto py-12 px-4 flex-grow">
        <HeroSection />

        {/* About Us Section */}
        <Card className="mb-12 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-primary">About Us</CardTitle>
            <CardDescription>Our story and mission</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Founded in 2023 by a group of passionate surfers, Wave Riders was born from a simple idea: make surfing accessible to everyone while helping board owners earn from their equipment when not in use.
            </p>
            <p>
              We connect surfboard owners with riders looking for the perfect board for their next wave-catching adventure. Our platform ensures a seamless, secure, and enjoyable experience for both parties.
            </p>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="mb-12 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-primary">How It Works</CardTitle>
            <CardDescription>Simple steps to get you surfing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="text-xl font-semibold mb-2">Browse</h3>
                <p>Explore our collection of surfboards from local owners</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="text-xl font-semibold mb-2">Book</h3>
                <p>Select your dates and request to rent the perfect board</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="text-xl font-semibold mb-2">Surf</h3>
                <p>Meet the owner, pick up your board, and hit the waves!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-cyan-500 p-12 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to catch some waves?</h2>
          <p className="text-white text-lg mb-6">Join our community of surfers today!</p>
          <div className="flex justify-center gap-4">
            <Link to="/boards">
              <Button variant="secondary" size="lg">Find a Board</Button>
            </Link>
            <Link to="/boards">
              <Button variant="outline" size="lg" className="bg-white/20 text-white border-white hover:bg-white/30">
                List Your Board
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
