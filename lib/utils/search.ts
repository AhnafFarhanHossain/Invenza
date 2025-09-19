import { Product } from '@/lib/context/SearchContext';

export function filterProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) {
    return products;
  }

  const searchTerm = query.toLowerCase().trim();
  
  return products.filter((product) => {
    // Search in multiple fields for better UX
    const searchableFields = [
      product.name,
      product.description,
      product.category,
      product.sku,
      product.unit,
    ].filter(Boolean); // Remove null/undefined values

    return searchableFields.some(field => 
      field.toLowerCase().includes(searchTerm)
    );
  });
}

export function highlightSearchTerm(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}