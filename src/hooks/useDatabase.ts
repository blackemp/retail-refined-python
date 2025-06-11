
import { useEffect, useState } from 'react';
import { database, Product, Sale, User } from '@/lib/database';

export const useDatabase = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [productsData, salesData, usersData] = await Promise.all([
        database.getProducts(),
        database.getSales(),
        database.getUsers()
      ]);
      
      setProducts(productsData);
      setSales(salesData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Products
  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'last_updated'>) => {
    try {
      await database.addProduct(product);
      await refreshData();
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    try {
      await database.updateProduct(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await database.deleteProduct(id);
      await refreshData();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const updateStock = async (productId: number, newStock: number) => {
    try {
      await database.updateStock(productId, newStock);
      await refreshData();
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  };

  // Sales
  const addSale = async (saleData: {
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
  }) => {
    try {
      const saleId = await database.addSale(saleData);
      await refreshData();
      return saleId;
    } catch (error) {
      console.error('Error adding sale:', error);
      throw error;
    }
  };

  // Users
  const addUser = async (user: Omit<User, 'id' | 'created_at' | 'last_login'>) => {
    try {
      await database.addUser(user);
      await refreshData();
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const updateUser = async (id: number, updates: Partial<User>) => {
    try {
      await database.updateUser(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await database.deleteUser(id);
      await refreshData();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  // Analytics
  const getTotalRevenue = () => database.getTotalRevenue();
  const getTotalOrders = () => database.getTotalOrders();
  const getAverageOrderValue = () => database.getAverageOrderValue();
  const getLowStockProducts = () => database.getLowStockProducts();
  const getOutOfStockProducts = () => database.getOutOfStockProducts();

  return {
    // Data
    products,
    sales,
    users,
    loading,
    
    // Actions
    refreshData,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    addSale,
    addUser,
    updateUser,
    deleteUser,
    
    // Analytics
    getTotalRevenue,
    getTotalOrders,
    getAverageOrderValue,
    getLowStockProducts,
    getOutOfStockProducts,
  };
};
