import { Routes } from '@/lib'
import axios from 'axios'
import { UseQueryOptions } from '@tanstack/react-query'
import { query } from '.'

export const getEmployeesAsOptions = <T = Schema.EmployeesOptions[]>(
	options?: UseQueryOptions<T>,
) => query<T>(
	['employees', 'options'],
	() => axios.get(Routes.apiEmployeesOptions()).then(res => res.data),
	options,
)

export const getEmployee = <T = Schema.Employee[]>(
	id: string,
	options?: UseQueryOptions<T>,
) => query<T>(
	['employees', id],
	() => axios.get(Routes.apiEmployee(id)).then(res => res.data),
	options,
)
