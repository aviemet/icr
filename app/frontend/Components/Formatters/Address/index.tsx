import { useMemo } from "react"
import { Box } from "@/Components"
import addressFormatter from "@fragaria/address-formatter"

interface AddressFormatterProps {
	address: Schema.Address
}

const AddressFormatter = ({ address }: AddressFormatterProps) => {
	const formatAddressLines = useMemo(() => {
		const addressData = {
			road: address.address_2
				? `${address.address}\n${address.address_2}`
				: address.address,
			city: address.city,
			state: address.region,
			postcode: address.postal,
			countryCode: address.country,
			name: address?.category
				? `${address.name} - ${address.category.name}`
				: address.name,
		}

		const formattedLines = addressFormatter.format(addressData, {
			output: "array",
			appendCountry: true,
		})
		return formattedLines.filter(Boolean)
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

export default AddressFormatter
