import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query'

export const query = <T>(
	key: (string|number)[],
	fn: () => Promise<T>,
	options?: UseQueryOptions<T>,
) => useQuery<T>({
	queryKey: key,
	queryFn: fn,
	...options,
})

export const mutation = <T>(
	key: (string|number)[],
	fn: (data: Partial<T>) => Promise<T>,
	options?: UseMutationOptions<T>,
) => useMutation({
	mutationKey: key,
	mutationFn: (data: Partial<T>) => fn(data),
	...options,
})
