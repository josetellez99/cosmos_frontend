import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  PROJECT_STATUS_FILTER_OPTIONS,
  type ProjectStatusType,
} from '@/lib/constants/project_statuses'
import type { GetProjectsRequest } from '@/features/projects/types/request/get-projects'

interface ProjectsStatusFilterProps {
  value: ProjectStatusType
  onChange: (updated: Pick<GetProjectsRequest, 'status'>) => void
}

export const ProjectsStatusFilter = ({
  value,
  onChange,
}: ProjectsStatusFilterProps) => {
  return (
    <Select
      value={value}
      onValueChange={(val) => {
        const status = val as ProjectStatusType
        onChange({ status: [status] })
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PROJECT_STATUS_FILTER_OPTIONS.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
