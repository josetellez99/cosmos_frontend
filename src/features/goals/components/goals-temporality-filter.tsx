import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TEMPORALITY_FILTER_OPTIONS,
  type GoalTemporalityType,
} from '@/lib/constants/goals_temporalities';
import type { GetUserGoalsRequest } from '@/features/goals/types/request/get-user-goals';
import { getTemporalityDateRange } from '@/features/goals/helpers/temporalityDateRange';

interface GoalsTemporalityFilterProps {
  value: GoalTemporalityType;
  onChange: (updated: Pick<GetUserGoalsRequest, 'temporality' | 'startDate' | 'endDate'>) => void;
}

export const GoalsTemporalityFilter = ({
  value,
  onChange,
}: GoalsTemporalityFilterProps) => {
  return (
    <Select
      value={value}
      onValueChange={(val) => {
        const temporality = val as GoalTemporalityType;
        onChange({ temporality: [temporality], ...getTemporalityDateRange(temporality) });
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TEMPORALITY_FILTER_OPTIONS.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
