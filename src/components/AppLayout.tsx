import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import SurfboardList from './SurfboardList';
import { useSurfboards } from '@/contexts/SurfboardContext';
import { useAuth } from '@/contexts/AuthContext';
import { UserRentalsView } from './UserRentalsView';
import { OwnerRentalsView } from './OwnerRentalsView';
import { UserProfileButton } from './auth/UserProfileButton';
import { AddSurfboardModal } from './AddSurfboardModal';

export default function AppLayout() {
  const [activeTab, setActiveTab] = useState('browse');
  const [showAddModal, setShowAddModal] = useState(false);
  const { surfboards, userSurfboards, loading, fetchSurfboards } = useSurfboards();
  const { user } = useAuth();

  // Fetch surfboards when component mounts
  useEffect(() => {
    fetchSurfboards();
  }, []); // Only run once on mount

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/30">
      <div className="container mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6 bg-card/80 backdrop-blur-sm p-4 rounded-lg shadow-md">
            <TabsList className="bg-secondary/80">
              <TabsTrigger value="browse">Browse Boards</TabsTrigger>
              {user && (
                <>
                  <TabsTrigger value="my-boards">My Boards</TabsTrigger>
                  <TabsTrigger value="my-rentals">My Rentals</TabsTrigger>
                  <TabsTrigger value="rental-requests">Rental Requests</TabsTrigger>
                </>
              )}
            </TabsList>
            
            <div className="flex items-center gap-2">
              {user && activeTab === 'my-boards' && (
                <Button onClick={() => setShowAddModal(true)} size="sm" className="bg-primary hover:bg-primary/90">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Board
                </Button>
              )}
              <UserProfileButton />
            </div>
          </div>

          <TabsContent value="browse" className="mt-0">
            <div className="space-y-6">
              <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Available Surfboards</h1>
                <p className="text-muted-foreground mt-2">
                  Browse and rent surfboards from local surfers in your area.
                </p>
              </div>
              
              <SurfboardList 
                surfboards={surfboards} 
                loading={loading} 
                emptyMessage="No surfboards available for rent"
              />
            </div>
          </TabsContent>

          <TabsContent value="my-boards" className="mt-0">
            <div className="space-y-6">
              <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold tracking-tight text-primary">My Surfboards</h1>
                <p className="text-muted-foreground mt-2">
                  Manage your surfboard listings and track rental requests.
                </p>
              </div>
              
              <SurfboardList 
                surfboards={userSurfboards} 
                isOwner={true} 
                loading={loading}
                emptyMessage="You haven't listed any surfboards yet"
              />
            </div>
          </TabsContent>

          <TabsContent value="my-rentals" className="mt-0">
            <div className="space-y-6">
              <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold tracking-tight text-primary">My Rentals</h1>
                <p className="text-muted-foreground mt-2">
                  View your rental history and current rentals.
                </p>
              </div>
              
              <UserRentalsView />
            </div>
          </TabsContent>

          <TabsContent value="rental-requests" className="mt-0">
            <div className="space-y-6">
              <div className="bg-card/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Rental Requests</h1>
                <p className="text-muted-foreground mt-2">
                  Manage rental requests for your surfboards.
                </p>
              </div>
              
              <OwnerRentalsView />
            </div>
          </TabsContent>
        </Tabs>

        {/* Use the modal version instead of inline form */}
        <AddSurfboardModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
        />
      </div>
    </div>
  );
}
