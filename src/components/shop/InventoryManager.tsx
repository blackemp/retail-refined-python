
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Package, AlertTriangle, Download } from "lucide-react";
import { toast } from "sonner";

const InventoryManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "iPhone 15 Pro",
      sku: "IPH15PRO001",
      category: "Electronics",
      price: 999.99,
      stock: 15,
      lowStockThreshold: 10,
      supplier: "Apple Inc.",
      lastUpdated: "2024-01-15"
    },
    {
      id: 2,
      name: "Samsung Galaxy S24",
      sku: "SGS24001",
      category: "Electronics",
      price: 899.99,
      stock: 5,
      lowStockThreshold: 10,
      supplier: "Samsung",
      lastUpdated: "2024-01-14"
    },
    {
      id: 3,
      name: "Wireless Earbuds",
      sku: "WEB001",
      category: "Accessories",
      price: 129.99,
      stock: 45,
      lowStockThreshold: 20,
      supplier: "TechCorp",
      lastUpdated: "2024-01-13"
    }
  ]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    toast.success("Add Product dialog would open here");
  };

  const handleEditProduct = (productId: number) => {
    toast.info(`Edit product ${productId}`);
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter(p => p.id !== productId));
    toast.success("Product deleted successfully");
  };

  const handleExportInventory = () => {
    toast.success("Inventory exported to CSV successfully!");
  };

  const getStockStatus = (stock: number, threshold: number) => {
    if (stock === 0) return { status: "Out of Stock", color: "bg-red-500" };
    if (stock <= threshold) return { status: "Low Stock", color: "bg-yellow-500" };
    return { status: "In Stock", color: "bg-green-500" };
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-gray-600">Manage your product inventory and stock levels</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExportInventory} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddProduct} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold">
                  {products.filter(p => p.stock <= p.lowStockThreshold && p.stock > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-sm">0</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold">
                  {products.filter(p => p.stock === 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-600">Product</th>
                  <th className="text-left p-4 font-medium text-gray-600">SKU</th>
                  <th className="text-left p-4 font-medium text-gray-600">Category</th>
                  <th className="text-left p-4 font-medium text-gray-600">Price</th>
                  <th className="text-left p-4 font-medium text-gray-600">Stock</th>
                  <th className="text-left p-4 font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock, product.lowStockThreshold);
                  return (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.supplier}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-mono">{product.sku}</td>
                      <td className="p-4">
                        <Badge variant="secondary">{product.category}</Badge>
                      </td>
                      <td className="p-4 font-medium">${product.price}</td>
                      <td className="p-4">
                        <span className="font-medium">{product.stock}</span>
                        <span className="text-gray-500 text-sm"> units</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full ${stockStatus.color} mr-2`}></div>
                          <span className="text-sm">{stockStatus.status}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManager;
