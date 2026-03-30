import type { GetUserSystemsRequest } from '@/features/systems/types/request/get-user-systems'

export const systemQueryKeys = {
	all: ['systems'] as const,
	lists: () => [...systemQueryKeys.all, 'list'] as const,
	list: (filters?: GetUserSystemsRequest) =>
		[...systemQueryKeys.lists(), { filters }] as const,
	details: () => [...systemQueryKeys.all, 'detail'] as const,
	detail: (id: number) => [...systemQueryKeys.details(), id] as const,
}
