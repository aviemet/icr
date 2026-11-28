import { isMoney, type Money } from "@/types"

export type UseCurrencyOptions = Omit<Intl.NumberFormatOptions, "style" | "currency">

interface UseCurrencyProps {
	amount: number | Money | null
	currency?: string
	locale?: string
	options?: UseCurrencyOptions
}

type OmittedOptions = Pick<Intl.NumberFormatOptions, "style" | "currency">

export function useCurrency({
	amount,
	currency = "USD",
	locale = "en-US",
	options = {},
}: UseCurrencyProps): [amount: number, formatter: Intl.NumberFormat] {
	const currencyIso = isMoney(amount) ? amount.currency_iso : currency
	const value = typeof amount === "number"
		? amount
		: (isMoney(amount) ? amount.amount : 0)

	const baseOptions: OmittedOptions = {
		style: "currency",
		currency: currencyIso,
	}

	const formatterOptions: Intl.NumberFormatOptions = Object.assign(options, baseOptions)

	const currencyFormatter = new Intl.NumberFormat(locale, formatterOptions)

	return [value, currencyFormatter]
}
