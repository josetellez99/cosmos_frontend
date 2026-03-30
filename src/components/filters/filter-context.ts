import { createContext, useContext } from 'react'

interface FilterContainerContextValue {
  close: () => void
  activeFilter: string | null
  setActiveFilter: (id: string | null) => void
}

export const FilterContainerContext = createContext<FilterContainerContextValue>({
  close: () => {},
  activeFilter: null,
  setActiveFilter: () => {},
})

export const useFilterContainerContext = () => useContext(FilterContainerContext)
