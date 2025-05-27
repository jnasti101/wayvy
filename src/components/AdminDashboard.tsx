import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminPanel } from '@/components/AdminPanel';
import { AllSurfboardsAdmin } from '@/components/AllSurfboardsAdmin';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
          <TabsTrigger value="all">All Surfboards</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <AdminPanel />
        </TabsContent>
        <TabsContent value="all">
          <AllSurfboardsAdmin />
        </TabsContent>
      </Tabs>
    </div>
  );
}
