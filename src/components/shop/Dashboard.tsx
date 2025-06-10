
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useStore } from "@/hooks/useStore";

const Dashboard = () => {
  const store = useStore();
  
  const totalRevenue = store.getTotalRevenue();
  const totalProducts = store.getProducts().length;
  const totalOrders = store.getTotalOrders();
  const activeUsers = store.getUsers().filter(u => u.status === 'active').length;
  const lowStockItems = store.getLowStockProducts();
  const topProducts = store.getTopSellingProducts();
  const salesData = store.getSalesData(7);

  const productCategories = [
    { name: 'Electronics', value: store.getProducts().filter(p => p.category === 'Electronics').length, color: '#8884d8' },
    { name: 'Accessories', value: store.getProducts().filter(p => p.category === 'Accessories').length, color: '#82ca9d' },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs opacity-90 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Live data from sales
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Products</CardTitle>
            <Package className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs opacity-90 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Active inventory
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs opacity-90 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Completed transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Active Users</CardTitle>
            <Users className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs opacity-90 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Registered users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.length === 0 ? (
                <p className="text-gray-500">No low stock items</p>
              ) : (
                lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Stock: {item.stock} units</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.length === 0 ? (
                <p className="text-gray-500">No sales data yet</p>
              ) : (
                topProducts.map((item, index) => (
                  <div key={item.product.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center">
                      <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">{item.quantitySold} units sold</p>
                      </div>
                    </div>
                    <p className="font-bold text-green-600">${item.revenue.toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
