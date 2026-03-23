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
} from '@/lib/constants/temporality';

interface GoalsTemporalityFilterProps {
  value: GoalTemporalityType;
  onChange: (temporality: GoalTemporalityType) => void;
}

export const GoalsTemporalityFilter = ({
  value,
  onChange,
}: GoalsTemporalityFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
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
