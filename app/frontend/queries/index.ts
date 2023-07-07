import {
	useMutation,
	useQuery,
	type UseMutationOptions,
	type UseQueryOptions,
	type MutationKey,
} from '@tanstack/react-query'

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
	key: MutationKey,
	fn: (data: Partial<T>) => Promise<Partial<T>>,
	options?: Omit<UseMutationOptions<Partial<T>>, 'mutationKey'|'mutationFn'>,
) => {
	return useMutation({
		mutationFn: fn,
		mutationKey: key,
		// ...options,
	})
}

export * from './clients'
export * from './employees'
