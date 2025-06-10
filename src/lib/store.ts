
// Simple store for managing application state
export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  supplier: string;
  lastUpdated: string;
}

export interface Sale {
  id: string;
  items: Array<{
    product: Product;
    quantity: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  timestamp: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

class Store {
  private products: Product[] = [
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
    },
    {
      id: 4,
      name: "Phone Case",
      sku: "PC001",
      category: "Accessories",
      price: 29.99,
      stock: 100,
      lowStockThreshold: 25,
      supplier: "CaseCorp",
      lastUpdated: "2024-01-12"
    },
    {
      id: 5,
      name: "Laptop Stand",
      sku: "LS001",
      category: "Accessories",
      price: 59.99,
      stock: 25,
      lowStockThreshold: 15,
      supplier: "StandTech",
      lastUpdated: "2024-01-11"
    },
    {
      id: 6,
      name: "Bluetooth Speaker",
      sku: "BS001",
      category: "Electronics",
      price: 79.99,
      stock: 30,
      lowStockThreshold: 20,
      supplier: "AudioTech",
      lastUpdated: "2024-01-10"
    }
  ];

  private sales: Sale[] = [];
  private users: User[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-15 09:30",
      createdAt: "2024-01-01"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "staff",
      status: "active",
      lastLogin: "2024-01-14 14:20",
      createdAt: "2024-01-05"
    }
  ];

  private listeners: Array<() => void> = [];

  // Products
  getProducts(): Product[] {
    return [...this.products];
  }

  updateProduct(id: number, updates: Partial<Product>): void {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { 
        ...this.products[index], 
        ...updates, 
        lastUpdated: new Date().toISOString().split('T')[0] 
      };
      this.notifyListeners();
    }
  }

  addProduct(product: Omit<Product, 'id'>): void {
    const newProduct = {
      ...product,
      id: Math.max(...this.products.map(p => p.id)) + 1
    };
    this.products.push(newProduct);
    this.notifyListeners();
  }

  deleteProduct(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
    this.notifyListeners();
  }

  updateStock(productId: number, quantity: number): void {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      product.stock = Math.max(0, product.stock + quantity);
      product.lastUpdated = new Date().toISOString().split('T')[0];
      this.notifyListeners();
    }
  }

  // Sales
  getSales(): Sale[] {
    return [...this.sales];
  }

  addSale(sale: Omit<Sale, 'id'>): string {
    const newSale = {
      ...sale,
      id: `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    // Update inventory
    sale.items.forEach(item => {
      this.updateStock(item.product.id, -item.quantity);
    });
    
    this.sales.push(newSale);
    this.notifyListeners();
    return newSale.id;
  }

  // Users
  getUsers(): User[] {
    return [...this.users];
  }

  addUser(user: Omit<User, 'id'>): void {
    const newUser = {
      ...user,
      id: Math.max(...this.users.map(u => u.id)) + 1
    };
    this.users.push(newUser);
    this.notifyListeners();
  }

  updateUser(id: number, updates: Partial<User>): void {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates };
      this.notifyListeners();
    }
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(u => u.id !== id);
    this.notifyListeners();
  }

  // Analytics
  getTotalRevenue(): number {
    return this.sales.reduce((total, sale) => total + sale.total, 0);
  }

  getTotalOrders(): number {
    return this.sales.length;
  }

  getAverageOrderValue(): number {
    const totalRevenue = this.getTotalRevenue();
    const totalOrders = this.getTotalOrders();
    return totalOrders > 0 ? totalRevenue / totalOrders : 0;
  }

  getLowStockProducts(): Product[] {
    return this.products.filter(p => p.stock <= p.lowStockThreshold && p.stock > 0);
  }

  getOutOfStockProducts(): Product[] {
    return this.products.filter(p => p.stock === 0);
  }

  getTopSellingProducts(): Array<{ product: Product; quantitySold: number; revenue: number }> {
    const productSales = new Map<number, { quantitySold: number; revenue: number }>();
    
    this.sales.forEach(sale => {
      sale.items.forEach(item => {
        const existing = productSales.get(item.product.id) || { quantitySold: 0, revenue: 0 };
        productSales.set(item.product.id, {
          quantitySold: existing.quantitySold + item.quantity,
          revenue: existing.revenue + item.total
        });
      });
    });

    return Array.from(productSales.entries())
      .map(([productId, sales]) => ({
        product: this.products.find(p => p.id === productId)!,
        ...sales
      }))
      .filter(item => item.product)
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 5);
  }

  getSalesData(days: number = 7): Array<{ date: string; sales: number; orders: number }> {
    const salesByDate = new Map<string, { sales: number; orders: number }>();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    this.sales
      .filter(sale => sale.timestamp >= startDate)
      .forEach(sale => {
        const dateKey = sale.timestamp.toISOString().split('T')[0];
        const existing = salesByDate.get(dateKey) || { sales: 0, orders: 0 };
        salesByDate.set(dateKey, {
          sales: existing.sales + sale.total,
          orders: existing.orders + 1
        });
      });

    return Array.from(salesByDate.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Listeners
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const store = new Store();
