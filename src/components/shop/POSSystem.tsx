
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Search, CreditCard, DollarSign, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/hooks/useStore";

const POSSystem = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "" });
  
  const store = useStore();
  const products = store.getProducts();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast.error("Not enough stock available");
      }
    } else {
      if (product.stock > 0) {
        setCart([...cart, { ...product, quantity: 1 }]);
      } else {
        toast.error("Product is out of stock");
      }
    }
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product && newQuantity <= product.stock) {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } else {
      toast.error("Not enough stock available");
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTax = () => {
    return getCartTotal() * 0.1; // 10% tax
  };

  const getFinalTotal = () => {
    return getCartTotal() + getTax();
  };

  const handleCheckout = (paymentMethod: string) => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    
    // Create sale record
    const saleData = {
      items: cart.map(item => ({
        product: item,
        quantity: item.quantity,
        total: item.price * item.quantity
      })),
      subtotal: getCartTotal(),
      tax: getTax(),
      total: getFinalTotal(),
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      paymentMethod: paymentMethod,
      timestamp: new Date()
    };
    
    // Add sale to store (this will also update inventory)
    const saleId = store.addSale(saleData);
    
    toast.success(`Payment processed via ${paymentMethod}! Sale ID: ${saleId.slice(-8)}`);
    setCart([]);
    setCustomerInfo({ name: "", phone: "" });
  };

  const clearCart = () => {
    setCart([]);
    toast.info("Cart cleared");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Products Section */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => addToCart(product)}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{product.name}</h3>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">${product.price}</span>
                      <span className={`text-sm ${product.stock === 0 ? 'text-red-500' : 'text-gray-500'}`}>
                        Stock: {product.stock}
                      </span>
                    </div>
                    <Button 
                      className="w-full mt-3" 
                      size="sm" 
                      disabled={product.stock === 0}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cart Section */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart ({cart.length})
              </CardTitle>
              {cart.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearCart}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer Info */}
            <div className="space-y-2">
              <Input
                placeholder="Customer Name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              />
              <Input
                placeholder="Phone Number"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              />
            </div>

            {/* Cart Items */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-sm text-gray-600">${item.price} each</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {cart.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Cart is empty</p>
              </div>
            )}

            {/* Totals */}
            {cart.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>${getTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${getFinalTotal().toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Payment Buttons */}
            {cart.length > 0 && (
              <div className="space-y-2 pt-4">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => handleCheckout('Cash')}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Cash Payment
                </Button>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleCheckout('Card')}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card Payment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default POSSystem;
