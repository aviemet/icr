import { Routes } from '@/lib'
import axios from 'axios'
import { query, mutation } from '..'

export const updateEmployee = <T = { employee: Partial<Schema.Employee> }>(
	id: string|number,
) => {
	const route = Routes.apiEmployee(id)
	return mutation<T>(
		['client', id],
		(data: Record<string, any>) => axios.patch(route, data),
	)
}
