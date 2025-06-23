// src/context/BuyerContext.jsx
import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { nanoid } from 'nanoid';

const BuyerContext = createContext();
export const useBuyers = () => useContext(BuyerContext);

export function BuyerProvider({ children }) {
  const [buyers, setBuyers] = useLocalStorage('buyers', []);

  /* CRUD thuần front‑end */
  const addBuyer    = (data)       => setBuyers((prev) => [...prev, { id: nanoid(), ...data }]);
  const updateBuyer = (id, data)   => setBuyers((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
  const deleteBuyer = (id)         => setBuyers((prev) => prev.filter((b) => b.id !== id));

  const value = { buyers, addBuyer, updateBuyer, deleteBuyer };
  return <BuyerContext.Provider value={value}>{children}</BuyerContext.Provider>;
}
