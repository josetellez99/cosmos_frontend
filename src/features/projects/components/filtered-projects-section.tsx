import { useState, useCallback } from 'react'
import { useProjectsSuspense } from '@/features/projects/hooks/useProjectsSuspense'
import { ProjectsList } from '@/features/projects/components/projects-list'
import { ProjectsStatusFilter } from '@/features/projects/components/projects-status-filter'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { AsyncErrorBoundary } from '@/components/async-boundary'
import { ProjectsListSkeleton } from '@/features/projects/components/loaders/projects-list-skeleton'
import { defaultProjectsPageReq } from '@/features/projects/constants/reqObjects'
import { projectStatus, type ProjectStatusType } from '@/lib/constants/project_statuses'
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

  const handleStatusChange = useCallback(
    (updated: Pick<GetProjectsRequest, 'status'>) => {
      setFilters(prev => ({ ...prev, ...updated }))
    }, []
  )

  const handleDateRangeChange = useCallback(
    (range: { from?: Date; to?: Date }) => {
      setDateRange(range)
      setFilters(prev => ({
        ...prev,
        startDate: range.from ? asISODateString(getYYYYMMDDformat(range.from.toISOString())) : undefined,
        endDate: range.to ? asISOTimestampString(range.to.toISOString()) : undefined,
      }))
    }, []
  )

  return (
    <>
      <div className="spacing-in-title-section flex gap-4">
        <ProjectsStatusFilter
          value={(filters.status?.[0] ?? projectStatus.IN_PROGRESS) as ProjectStatusType}
          onChange={handleStatusChange}
        />
        <DateRangePicker
          from={dateRange.from}
          to={dateRange.to}
          onChange={handleDateRangeChange}
          placeholder="Filtrar por deadline"
        />
      </div>
      <AsyncErrorBoundary loadingFallback={<ProjectsListSkeleton />}>
        <FilteredProjectsList filters={filters} />
      </AsyncErrorBoundary>
    </>
  )
}
