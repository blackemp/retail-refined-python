
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Package, ShoppingCart, Users, BarChart3, Settings, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import Dashboard from "@/components/shop/Dashboard";
import InventoryManager from "@/components/shop/InventoryManager";
import POSSystem from "@/components/shop/POSSystem";
import UserManager from "@/components/shop/UserManager";
import ReportsAnalytics from "@/components/shop/ReportsAnalytics";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleDownloadApp = () => {
    toast.success("Download initiated! Your offline version will be ready shortly.");
    // This would trigger the download of a PWA or Electron wrapper
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ShopMaster Pro</h1>
                <p className="text-sm text-gray-600">Complete Shop Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleDownloadApp} className="bg-indigo-600 hover:bg-indigo-700">
                <Download className="h-4 w-4 mr-2" />
                Download App
              </Button>
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-green-800">Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white p-1 rounded-lg shadow-lg">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center space-x-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <Package className="h-4 w-4" />
              <span>Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="pos" className="flex items-center space-x-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <DollarSign className="h-4 w-4" />
              <span>POS</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="inventory">
            <InventoryManager />
          </TabsContent>
          
          <TabsContent value="pos">
            <POSSystem />
          </TabsContent>
          
          <TabsContent value="users">
            <UserManager />
          </TabsContent>
          
          <TabsContent value="reports">
            <ReportsAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
