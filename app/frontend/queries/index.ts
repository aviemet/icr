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
interface LimitedQueryOptions<T> extends Omit<UseQueryOptions<T>, "queryKey" | "queryFn"> {}

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

type IfEmpty<T, TrueType, FalseType> = keyof T extends never ? TrueType : FalseType;

type MutationOptions<T, P, O> = Omit<UseMutationOptions<T, unknown, P, unknown>, "mutationKey" | "onSuccess"> & {
	onSuccess?: (data: T, variables: P) => void
} & IfEmpty<O, {}, { params: O }>;

export type ReactMutationFunction<
	T, // Data type returned by the mutation
	P, // Data type passed to mutate function
	O extends Record<string, unknown> = {} // Optional parameters for setting up hook
> = (
	options?: MutationOptions<T, P, O>
) => UseMutationResult<T, unknown, P, unknown>;

/**
 * Folder exports
 */
export * from "./categories"
export * from "./clients"
export * from "./employees"
export * from "./locale"
export * from "./users"
