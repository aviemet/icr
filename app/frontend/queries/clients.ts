import { Routes } from '@/lib'
import axios from 'axios'
import { UseQueryOptions  } from '@tanstack/react-query'
import { query } from '.'

export const getClientShifts = <T = Schema.ShiftsCalendar[]>(
	params: {
		id: string|number
		start?: Date
		end?: Date
	},
	options?: UseQueryOptions<T>,
) => query<T>(
	['shifts'],
	() => axios.get(Routes.apiClientShifts(params.id, {
		starts_at: params.start, ends_at: params.end,
	}))
		.then(res => res.data),
	options,
)
