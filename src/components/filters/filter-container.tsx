import { useState, useCallback } from 'react'
import { ListFilter, ChevronDown } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { FilterContainerContext } from '@/components/filters/filter-context'

interface FilterContainerProps {
  children: React.ReactNode
  onClearAll: () => void
}

export const FilterContainer = ({ children, onClearAll }: FilterContainerProps) => {
  const [open, setOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const close = useCallback(() => {
    setOpen(false)
    setActiveFilter(null)
  }, [])

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) setActiveFilter(null)
  }, [])

  return (
    <FilterContainerContext.Provider value={{ close, activeFilter, setActiveFilter }}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ListFilter className="size-3 text-medium-gray" />
            <Typography as="p" className="text-medium-gray">Filtros</Typography>
            <ChevronDown className="size-3 text-medium-gray" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={8} className="w-auto p-0 border border-transparent">
          {children}
          {activeFilter === null && (
            <>
              <div className="border-t border-border" />
              <div className="p-2">
                <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => { onClearAll(); close() }}>
                  Limpiar todo
                </Button>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </FilterContainerContext.Provider>
  )
}
