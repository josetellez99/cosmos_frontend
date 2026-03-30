import { useState, useCallback } from 'react'
import { CircleDot, CalendarIcon } from 'lucide-react'
import { useProjectsSuspense } from '@/features/projects/hooks/useProjectsSuspense'
import { ProjectsList } from '@/features/projects/components/projects-list'
import { FilterContainer, FilterItem, FilterOptionList, FilterCalendar } from '@/components/filters'
import { AsyncErrorBoundary } from '@/components/async-boundary'
import { ProjectsListSkeleton } from '@/features/projects/components/loaders/projects-list-skeleton'
import { defaultProjectsPageReq } from '@/features/projects/constants/reqObjects'
import { PROJECT_STATUS_FILTER_OPTIONS, type ProjectStatusType } from '@/lib/constants/project_statuses'
import type { GetProjectsRequest } from '@/features/projects/types/request/get-projects'
import { asISODateString, asISOTimestampString } from '@/types/dates'
import { getYYYYMMDDformat } from '@/helpers/dates/get-YYYY-MM-DD-format'

const FilteredProjectsList = ({ filters }: { filters: GetProjectsRequest }) => {
  const { projects } = useProjectsSuspense(filters)
  return <ProjectsList projects={projects} fallbackMessage='No hay proyectos con estos filtros.' />
}

export const FilteredProjectsSection = () => {

  const [filters, setFilters] = useState<GetProjectsRequest>(defaultProjectsPageReq)
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})

  console.log(filters)

  const handleStatusChange = useCallback(
    (val: string) => {
      setFilters(prev => ({ ...prev, status: [val as ProjectStatusType] }))
    }, []
  )

  const handleStatusClear = useCallback(() => {
    setFilters(prev => ({ ...prev, status: undefined }))
  }, [])

  const handleDateRangeChange = useCallback(
    (range: { from?: Date; to?: Date }) => {
      setDateRange(range)
      setFilters(prev => ({
        ...prev,
        startDate: range.from ? asISODateString(getYYYYMMDDformat(range.from.toISOString())) : undefined,
        endDate: range.to ? asISOTimestampString(new Date(range.to.getFullYear(), range.to.getMonth(), range.to.getDate(), 23, 59, 59).toISOString()) : undefined,
      }))
    }, []
  )

  const handleDateRangeClear = useCallback(() => {
    setDateRange({})
    setFilters(prev => ({ ...prev, startDate: undefined, endDate: undefined }))
  }, [])

  const handleClearAll = useCallback(() => {
    setDateRange({})
    setFilters(defaultProjectsPageReq)
  }, [])

  const isStatusActive = !!filters.status?.length
  const isDateRangeActive = !!dateRange.from

  return (
    <>
      <div className="spacing-in-title-section flex justify-end">
        <FilterContainer onClearAll={handleClearAll}>
          <FilterItem id="status" icon={CircleDot} label="Estatus" isActive={isStatusActive}>
            <FilterOptionList
              options={PROJECT_STATUS_FILTER_OPTIONS}
              value={filters.status?.[0]}
              onSelect={handleStatusChange}
              onClear={handleStatusClear}
            />
          </FilterItem>
          <FilterItem id="date-range" icon={CalendarIcon} label="Fecha limite" isActive={isDateRangeActive}>
            <FilterCalendar
              mode="range"
              from={dateRange.from}
              to={dateRange.to}
              onChange={handleDateRangeChange}
              onClear={handleDateRangeClear}
            />
          </FilterItem>
        </FilterContainer>
      </div>
      <AsyncErrorBoundary loadingFallback={<ProjectsListSkeleton />}>
        <FilteredProjectsList filters={filters} />
      </AsyncErrorBoundary>
    </>
  )
}
