import { createContext, useContext } from 'react'

export const DataContext = createContext(null)

export function useContent() {
  return useContext(DataContext)
}
