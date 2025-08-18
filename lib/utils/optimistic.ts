import { Product } from '@/lib/context/SearchContext';

export interface OptimisticAction<T = unknown> {
  type: string;
  payload: T;
  optimisticId?: string;
}

export class OptimisticUpdates<T> {
  private optimisticQueue: Map<string, OptimisticAction<T>> = new Map();
  private rollbackData: Map<string, T[]> = new Map();

  // Add an optimistic update
  addOptimisticUpdate(
    originalData: T[], 
    action: OptimisticAction<T>,
    updateFn: (data: T[], action: OptimisticAction<T>) => T[]
  ): { data: T[], optimisticId: string } {
    const optimisticId = `optimistic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const actionWithId = { ...action, optimisticId };
    
    // Store original data for potential rollback
    this.rollbackData.set(optimisticId, [...originalData]);
    
    // Store the optimistic action
    this.optimisticQueue.set(optimisticId, actionWithId);
    
    // Apply the optimistic update
    const updatedData = updateFn(originalData, actionWithId);
    
    return { data: updatedData, optimisticId };
  }

  // Confirm an optimistic update (remove from queue)
  confirmUpdate(optimisticId: string): void {
    this.optimisticQueue.delete(optimisticId);
    this.rollbackData.delete(optimisticId);
  }

  // Rollback an optimistic update
  rollbackUpdate(optimisticId: string): T[] | null {
    const originalData = this.rollbackData.get(optimisticId);
    if (originalData) {
      this.optimisticQueue.delete(optimisticId);
      this.rollbackData.delete(optimisticId);
      return [...originalData];
    }
    return null;
  }

  // Get pending optimistic updates
  getPendingUpdates(): OptimisticAction<T>[] {
    return Array.from(this.optimisticQueue.values());
  }

  // Clear all optimistic updates
  clear(): void {
    this.optimisticQueue.clear();
    this.rollbackData.clear();
  }
}

// Product-specific optimistic updates
export const productOptimisticUpdates = new OptimisticUpdates<Product>();

export function optimisticallyAddProduct(products: Product[], newProduct: Partial<Product>): Product[] {
  const tempProduct: Product = {
    _id: `temp_${Date.now()}`,
    name: newProduct.name || '',
    description: newProduct.description || '',
    category: newProduct.category || '',
    sku: newProduct.sku || '',
    quantity: newProduct.quantity || 0,
    reorderLevel: newProduct.reorderLevel || 0,
    costPrice: newProduct.costPrice || 0,
    sellPrice: newProduct.sellPrice || 0,
    unit: newProduct.unit || '',
    image: newProduct.image || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return [tempProduct, ...products];
}

export function optimisticallyUpdateProduct(products: Product[], updatedProduct: Product): Product[] {
  return products.map(product => 
    product._id === updatedProduct._id ? updatedProduct : product
  );
}

export function optimisticallyDeleteProduct(products: Product[], productId: string): Product[] {
  return products.filter(product => product._id !== productId);
}