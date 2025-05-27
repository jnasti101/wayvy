import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Wave Riders</h3>
            <p className="mb-4">Connecting surfers with the perfect boards since 2023.</p>
            <p>© {new Date().getFullYear()} Wave Riders. All rights reserved.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/boards" className="hover:underline">Browse Boards</Link></li>
              <li><Link to="/boards" className="hover:underline">List Your Board</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="mb-2">1234 Surf Avenue</p>
            <p className="mb-2">Ocean City, CA 90210</p>
            <p className="mb-2">contact@waveriders.com</p>
            <p>(555) 123-4567</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
