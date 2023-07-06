import { Routes } from '@/lib'
import axios from 'axios'
import { query, mutation } from '..'

export const updateEmployee = <T = Schema.Employee>(
	id: string|number,
) => {
	return mutation<T>(
		['client', id],
		(data: Record<string, any>) => axios.patch(Routes.apiUpdateEmployeeSettings(id), data),
	)
}
