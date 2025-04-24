import {
	type UseQueryOptions,
	type UseMutationOptions,
	type UseQueryResult,
	type UseMutationResult,
} from "@tanstack/react-query"

/**
 * Query types
 */

// Exclude the functions which will be called in the query definitions
interface LimitedQueryOptions<T, E = Error> extends Omit<UseQueryOptions<T, E>, "queryKey" | "queryFn"> {}

type ReactQueryFunctionBasic<T, E = Error> = (
	options?: LimitedQueryOptions<T, E>
) => UseQueryResult<T, E>

type ReactQueryFunctionWithParams<T, P extends Record<string, string | number | string[] | Date | null | undefined>, E = Error> = (
	params: P, options?: LimitedQueryOptions<T, E>
) => UseQueryResult<T, E>

export type ReactQueryFunction<T, P = undefined, E = Error> =
	P extends undefined
		? ReactQueryFunctionBasic<T, E>
		: P extends Record<string, string | number | string[] | Date | null | undefined>
			? ReactQueryFunctionWithParams<T, P, E>
			: never

/**
 * Mutation types
 */

type IfEmpty<T, TrueType, FalseType> = keyof T extends never ? TrueType : FalseType

type MutationOptions<T, P, O, E> = Omit<UseMutationOptions<T, E, P, unknown>, "mutationKey" | "onSuccess"> & {
	onSuccess?: (data: T, variables: P) => void
} & IfEmpty<O, {}, { params: O }>

export type ReactMutationFunction<
	T, // Data type returned by the mutation
	P, // Data type passed to mutate function
	O extends Record<string, unknown> = {}, // Optional parameters for setting up hook
	E = Error,
	C = unknown
> = (
	options: MutationOptions<T, P, O, E>
) => UseMutationResult<T, E, P, C>

/**
 * Folder exports
 */
export * from "./calendarEvents"
export * from "./categories"
export * from "./clients"
export * from "./employees"
export * from "./locale"
export * from "./users"
export * from "./jobTitles"
