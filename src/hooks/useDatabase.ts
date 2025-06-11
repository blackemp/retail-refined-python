import { useEffect, useState } from 'react';
import { database, Product, Sale, User, Invoice } from '@/lib/database';

export const useDatabase = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [productsData, salesData, usersData, invoicesData] = await Promise.all([
        database.getProducts(),
        database.getSales(),
        database.getUsers(),
        database.getInvoices()
      ]);
      
      setProducts(productsData);
      setSales(salesData);
      setUsers(usersData);
      setInvoices(invoicesData);
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

  // Invoices
  const createInvoice = async (invoiceData: Parameters<typeof database.createInvoice>[0]) => {
    try {
      const invoiceId = await database.createInvoice(invoiceData);
      await refreshData();
      return invoiceId;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  };

  const updateInvoiceStatus = async (id: string, status: Invoice['status']) => {
    try {
      await database.updateInvoiceStatus(id, status);
      await refreshData();
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      await database.deleteInvoice(id);
      await refreshData();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  };

  const getInvoiceById = (id: string) => database.getInvoiceById(id);
  const getInvoiceItems = (invoiceId: string) => database.getInvoiceItems(invoiceId);

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
    invoices,
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
    
    // Invoice actions
    createInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    getInvoiceById,
    getInvoiceItems,
    
    // Analytics
    getTotalRevenue,
    getTotalOrders,
    getAverageOrderValue,
    getLowStockProducts,
    getOutOfStockProducts,
  };
};
