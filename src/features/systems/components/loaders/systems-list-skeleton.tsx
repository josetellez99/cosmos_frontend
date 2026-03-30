import { SystemItemSkeleton } from "@/features/systems/components/loaders/system-item-skeleton"

interface SystemsListSkeletonProps {
	count?: number
}

export const SystemsListSkeleton = ({ count = 3 }: SystemsListSkeletonProps) => (
	<ul className="flex flex-col spacing-in-list-elements">
		{Array.from({ length: count }).map((_, i) => (
			<li key={i}>
				<SystemItemSkeleton />
			</li>
		))}
	</ul>
)
