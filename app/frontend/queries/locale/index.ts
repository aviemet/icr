import { Routes } from '@/lib'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { type ReactQueryFunction } from '..'

export const useGetCurrencies: ReactQueryFunction<Schema.CurrencyOption[]> = options => {
	return useQuery({
		queryKey: ['currencies'],
		queryFn: async () => {
			const res = await axios.get(Routes.apiCurrencies())
			return res.data
		},
		...options,
	})
}

export const useGetTimezones: ReactQueryFunction<Schema.CurrencyOption[]> = options => {
	return useQuery({
		queryKey: ['timezones'],
		queryFn: async () => {
			const res = await axios.get(Routes.apiTimezones())
			return res.data
		},
		...options,
	})
}

export const useGetPayPeriodTypes: ReactQueryFunction<any[]> = options => {
	return useQuery({
		queryKey: ['payPeriodTypes'],
		queryFn: async () => {
			const res = await axios.get(Routes.apiPayPeriods())
			return res.data
		},
		...options,
	})
}

export const useGetLanguages: ReactQueryFunction<any[]> = options => {
	return useQuery({
		queryKey: ['languages'],
		queryFn: async () => {
			const res = await axios.get(Routes.apiLanguages())
			return res.data
		},
		...options,
	})
}
