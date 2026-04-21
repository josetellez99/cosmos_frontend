export const habitQueryKeys = {
  all: ['habits'] as const,
  lists: () => [...habitQueryKeys.all, 'list'] as const,
  list: () =>
    [...habitQueryKeys.lists()] as const,
  details: () => [...habitQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...habitQueryKeys.details(), id] as const,
  byDate: (date: string, dateType: string) => [...habitQueryKeys.all, 'byDate', date, dateType] as const,
}
