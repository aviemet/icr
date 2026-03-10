import addressFormatter from "@fragaria/address-formatter"
import { useMemo } from "react"

import { Box } from "@/components"

export interface AddressFormatterProps {
	address: Schema.Address
}

export function AddressFormatter({ address }: AddressFormatterProps) {
	const formatAddressLines = useMemo(() => {
		const toStr = (v: unknown): string | undefined =>
			v !== null && v !== undefined && v !== "" ? String(v) : undefined
		const addressData: Parameters<typeof addressFormatter.format>[0] = {
			road: address.address_2
				? `${String(address.address)}\n${String(address.address_2)}`
				: toStr(address.address),
			city: toStr(address.city),
			state: toStr(address.region),
			postcode: toStr(address.postal),
			countryCode: toStr(address.country),
		}
		const nameLine =
			address?.category !== undefined && address?.category !== null
				? `${String(address.name)} - ${String(address.category.name)}`
				: toStr(address.name)
		const formattedLines = addressFormatter.format(addressData, {
			output: "array",
			appendCountry: true,
		})
		const lines = formattedLines.filter(Boolean)
		return nameLine !== undefined ? [nameLine, ...lines] : lines
	}, [address])

	return (
		<address>
			{ formatAddressLines.map((line, index) => (
				<Box key={ index }>
					{ line }
				</Box>
			)) }
		</address>
	)
}
