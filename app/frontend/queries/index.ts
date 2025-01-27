import {
	type UseQueryOptions,
	type UseMutationOptions,
	type UseQueryResult,
	type UseMutationResult,
} from '@tanstack/react-query'

/**
 * Query types
 */

// Exclude the functions which will be called in the query definitions
interface LimitedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {}

type ReactQueryFunctionBasic<T> = (options?: LimitedQueryOptions<T>) => UseQueryResult<T, Error>;
type ReactQueryFunctionWithParams<T, P extends Record<string, string | number | string[]>> = (params: P, options?: LimitedQueryOptions<T>) => UseQueryResult<T, Error>;

export type ReactQueryFunction<T, P = undefined> =
	P extends undefined
		? ReactQueryFunctionBasic<T>
		: P extends Record<string, string | number | string[]>
			? ReactQueryFunctionWithParams<T, P>
			: never;

/**
 * Mutation types
 */

interface LimitedMutationOptions<T, P> extends Omit<UseMutationOptions<T, unknown, P, unknown>, 'mutationKey' | 'onSuccess'> {
	onSuccess?: (data: T, variables: P) => void
}

export type ReactMutationFunction<T, P extends Record<string, unknown>> = (
	params: P,
	options?: LimitedMutationOptions<T, P>
) => UseMutationResult<T, unknown, P, unknown>;

/**
 * Folder exports
 */
export * from './employees'
