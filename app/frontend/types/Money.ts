export type Money = {
	amount: number
	cents: number
	currency_iso: string
}

export function isMoney(value: unknown): value is Money {
	if(typeof value !== "object" || value === null) return false

	const record = value as Record<string, unknown>
	return typeof record.amount === "number"
		&& typeof record.cents === "number"
		&& typeof record.currency_iso === "string"
}

export type { Money as default }
