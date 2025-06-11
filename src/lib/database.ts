
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  low_stock_threshold: number;
  supplier: string;
  last_updated: string;
  created_at: string;
}

export interface Sale {
  id: string;
  subtotal: number;
  tax: number;
  total: number;
  customer_name: string | null;
  customer_phone: string | null;
  payment_method: string;
  created_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: number;
  quantity: number;
  price: number;
  total: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  status: 'active' | 'inactive';
  last_login: string | null;
  created_at: string;
}

class DatabaseService {
  // Products
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
    
    return data || [];
  }

  async addProduct(product: Omit<Product, 'id' | 'created_at' | 'last_updated'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...product,
        last_updated: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding product:', error);
      throw error;
    }
    
    return data;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update({
        ...updates,
        last_updated: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
    
    return data;
  }

  async deleteProduct(id: number): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async updateStock(productId: number, newStock: number): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update({ 
        stock: newStock,
        last_updated: new Date().toISOString()
      })
      .eq('id', productId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
    
    return data;
  }

  // Sales
  async getSales(): Promise<Sale[]> {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
    
    return data || [];
  }

  async addSale(saleData: {
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
  }): Promise<string> {
    // Start a transaction-like operation
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert([{
        subtotal: saleData.subtotal,
        tax: saleData.tax,
        total: saleData.total,
        customer_name: saleData.customerName || null,
        customer_phone: saleData.customerPhone || null,
        payment_method: saleData.paymentMethod
      }])
      .select()
      .single();

    if (saleError) {
      console.error('Error creating sale:', saleError);
      throw saleError;
    }

    // Add sale items
    const saleItems = saleData.items.map(item => ({
      sale_id: sale.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
      total: item.total
    }));

    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems);

    if (itemsError) {
      console.error('Error adding sale items:', itemsError);
      throw itemsError;
    }

    // Update product stock
    for (const item of saleData.items) {
      const newStock = item.product.stock - item.quantity;
      await this.updateStock(item.product.id, Math.max(0, newStock));
    }

    return sale.id;
  }

  // Users
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    
    return data || [];
  }

  async addUser(user: Omit<User, 'id' | 'created_at' | 'last_login'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding user:', error);
      throw error;
    }
    
    return data;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }
    
    return data;
  }

  async deleteUser(id: number): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Analytics functions
  async getTotalRevenue(): Promise<number> {
    const { data, error } = await supabase
      .from('sales')
      .select('total');
    
    if (error) {
      console.error('Error calculating total revenue:', error);
      return 0;
    }
    
    return data?.reduce((sum, sale) => sum + sale.total, 0) || 0;
  }

  async getTotalOrders(): Promise<number> {
    const { count, error } = await supabase
      .from('sales')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error counting orders:', error);
      return 0;
    }
    
    return count || 0;
  }

  async getAverageOrderValue(): Promise<number> {
    const totalRevenue = await this.getTotalRevenue();
    const totalOrders = await this.getTotalOrders();
    return totalOrders > 0 ? totalRevenue / totalOrders : 0;
  }

  async getLowStockProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .gt('stock', 0)
      .filter('stock', 'lte', 'low_stock_threshold');
    
    if (error) {
      console.error('Error fetching low stock products:', error);
      return [];
    }
    
    return data || [];
  }

  async getOutOfStockProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('stock', 0);
    
    if (error) {
      console.error('Error fetching out of stock products:', error);
      return [];
    }
    
    return data || [];
  }
}

export const database = new DatabaseService();
