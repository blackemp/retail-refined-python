
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, DollarSign, ShoppingCart, Users, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { toast } from "sonner";
import { useStore } from "@/hooks/useStore";

const ReportsAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const store = useStore();
  
  const totalRevenue = store.getTotalRevenue();
  const totalOrders = store.getTotalOrders();
  const averageOrderValue = store.getAverageOrderValue();
  const activeUsers = store.getUsers().filter(u => u.status === 'active').length;
  const topProducts = store.getTopSellingProducts();
  const salesData = store.getSalesData(selectedPeriod === '7days' ? 7 : selectedPeriod === '30days' ? 30 : 90);

  const salesByCategory = [
    { 
      name: 'Electronics', 
      value: store.getSales().reduce((acc, sale) => {
        return acc + sale.items
          .filter(item => item.product.category === 'Electronics')
          .reduce((sum, item) => sum + item.total, 0);
      }, 0), 
      color: '#8884d8' 
    },
    { 
      name: 'Accessories', 
      value: store.getSales().reduce((acc, sale) => {
        return acc + sale.items
          .filter(item => item.product.category === 'Accessories')
          .reduce((sum, item) => sum + item.total, 0);
      }, 0), 
      color: '#82ca9d' 
    },
  ];

  const handleExportReport = (reportType: string) => {
    if (reportType === 'Sales') {
      const sales = store.getSales();
      const csvContent = [
        "Sale ID,Date,Customer,Items,Subtotal,Tax,Total,Payment Method",
        ...sales.map(sale => 
          `${sale.id},${sale.timestamp.toISOString()},${sale.customerName},${sale.items.length},${sale.subtotal},${sale.tax},${sale.total},${sale.paymentMethod}`
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sales_report.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (reportType === 'Inventory') {
      const products = store.getProducts();
      const csvContent = [
        "Name,SKU,Category,Price,Stock,Low Stock Threshold,Supplier,Last Updated",
        ...products.map(p => `${p.name},${p.sku},${p.category},${p.price},${p.stock},${p.lowStockThreshold},${p.supplier},${p.lastUpdated}`)
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inventory_report.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
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
                { value: '90days', label: 'Last 90 Days' }
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
                <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                <p className="text-xs opacity-90 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Live data from sales
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
                <p className="text-2xl font-bold">{totalOrders}</p>
                <p className="text-xs opacity-90 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Completed transactions
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
                <p className="text-2xl font-bold">{formatCurrency(averageOrderValue)}</p>
                <p className="text-xs opacity-90 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Per transaction
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
                <p className="text-sm opacity-90">Active Users</p>
                <p className="text-2xl font-bold">{activeUsers}</p>
                <p className="text-xs opacity-90 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Registered users
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
                  data={salesByCategory.filter(item => item.value > 0)}
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
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products and Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No sales data available yet</p>
              ) : (
                topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.product.name}</p>
                        <p className="text-sm text-gray-600">{product.quantitySold} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-600">Revenue Breakdown</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Gross Sales:</span>
                    <span className="font-medium">{formatCurrency(totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Collected:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(store.getSales().reduce((acc, sale) => acc + sale.tax, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-1">
                    <span>Net Sales:</span>
                    <span>{formatCurrency(store.getSales().reduce((acc, sale) => acc + sale.subtotal, 0))}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-600">Order Statistics</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Total Orders:</span>
                    <span className="font-medium">{totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Order:</span>
                    <span className="font-medium">{formatCurrency(averageOrderValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Items Sold:</span>
                    <span className="font-medium">
                      {store.getSales().reduce((acc, sale) => 
                        acc + sale.items.reduce((sum, item) => sum + item.quantity, 0), 0
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
