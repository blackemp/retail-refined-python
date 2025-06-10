
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, TrendingUp, DollarSign, ShoppingCart, Users, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { toast } from "sonner";

const ReportsAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");

  // Sample data - in real app this would come from your backend
  const salesData = [
    { date: '2024-01-01', sales: 4000, orders: 120, customers: 45 },
    { date: '2024-01-02', sales: 3000, orders: 98, customers: 38 },
    { date: '2024-01-03', sales: 5000, orders: 145, customers: 52 },
    { date: '2024-01-04', sales: 2780, orders: 89, customers: 34 },
    { date: '2024-01-05', sales: 1890, orders: 67, customers: 28 },
    { date: '2024-01-06', sales: 2390, orders: 78, customers: 31 },
    { date: '2024-01-07', sales: 3490, orders: 112, customers: 41 },
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro', sales: 45, revenue: 44995 },
    { name: 'Samsung Galaxy S24', sales: 32, revenue: 28800 },
    { name: 'Wireless Earbuds', sales: 78, revenue: 10140 },
    { name: 'Phone Case', sales: 156, revenue: 4680 },
    { name: 'Laptop Stand', sales: 23, revenue: 1380 },
  ];

  const salesByCategory = [
    { name: 'Electronics', value: 65, color: '#8884d8' },
    { name: 'Accessories', value: 25, color: '#82ca9d' },
    { name: 'Cases & Covers', value: 10, color: '#ffc658' },
  ];

  const monthlyRevenue = [
    { month: 'Jan', revenue: 45000, target: 50000 },
    { month: 'Feb', revenue: 52000, target: 50000 },
    { month: 'Mar', revenue: 48000, target: 50000 },
    { month: 'Apr', revenue: 61000, target: 50000 },
    { month: 'May', revenue: 55000, target: 50000 },
    { month: 'Jun', revenue: 67000, target: 50000 },
  ];

  const handleExportReport = (reportType: string) => {
    toast.success(`${reportType} report exported successfully!`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => handleExportReport('Sales')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Sales
          </Button>
          <Button onClick={() => handleExportReport('Inventory')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Inventory
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Time Period:</span>
            <div className="flex gap-2">
              {[
                { value: '7days', label: 'Last 7 Days' },
                { value: '30days', label: 'Last 30 Days' },
                { value: '90days', label: 'Last 90 Days' },
                { value: 'year', label: 'This Year' }
              ].map((period) => (
                <Button
                  key={period.value}
                  variant={selectedPeriod === period.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period.value)}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Revenue</p>
                <p className="text-2xl font-bold">$124,563</p>
                <p className="text-xs opacity-90 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% vs last period
                </p>
              </div>
              <DollarSign className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Orders</p>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-xs opacity-90 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.2% vs last period
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Avg Order Value</p>
                <p className="text-2xl font-bold">$101.02</p>
                <p className="text-xs opacity-90 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3.8% vs last period
                </p>
              </div>
              <div className="h-8 w-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">$</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">New Customers</p>
                <p className="text-2xl font-bold">89</p>
                <p className="text-xs opacity-90 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15.3% vs last period
                </p>
              </div>
              <Users className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: any) => [formatCurrency(value), 'Sales']}
                />
                <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue vs Target</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                <Bar dataKey="target" fill="#82ca9d" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-600">Revenue Breakdown</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Gross Sales:</span>
                  <span className="font-medium">$124,563</span>
                </div>
                <div className="flex justify-between">
                  <span>Returns:</span>
                  <span className="font-medium text-red-600">-$2,341</span>
                </div>
                <div className="flex justify-between">
                  <span>Discounts:</span>
                  <span className="font-medium text-orange-600">-$1,890</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-1">
                  <span>Net Sales:</span>
                  <span>$120,332</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-600">Costs & Expenses</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Cost of Goods:</span>
                  <span className="font-medium">$72,199</span>
                </div>
                <div className="flex justify-between">
                  <span>Operating Costs:</span>
                  <span className="font-medium">$8,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes:</span>
                  <span className="font-medium">$4,815</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-1">
                  <span>Total Costs:</span>
                  <span>$85,514</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-600">Profit Analysis</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Gross Profit:</span>
                  <span className="font-medium text-green-600">$48,133</span>
                </div>
                <div className="flex justify-between">
                  <span>Net Profit:</span>
                  <span className="font-medium text-green-600">$34,818</span>
                </div>
                <div className="flex justify-between">
                  <span>Profit Margin:</span>
                  <span className="font-medium">28.9%</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-1">
                  <span>ROI:</span>
                  <span className="text-green-600">40.7%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsAnalytics;
