// src/context/ProductContext.jsx
import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { nanoid } from 'nanoid';

const ProductContext = createContext();
export const useProducts = () => useContext(ProductContext);

export function ProductProvider({ children }) {
  const [products, setProducts] = useLocalStorage('products', []);

  const addProduct    = (data)       => setProducts((p) => [...p, { id: nanoid(), ...data }]);
  const updateProduct = (id, data)   => setProducts((p) => p.map((x) => (x.id === id ? { ...x, ...data } : x)));
  const deleteProduct = (id)         => setProducts((p) => p.filter((x) => x.id !== id));

  const value = { products, addProduct, updateProduct, deleteProduct };
  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}
