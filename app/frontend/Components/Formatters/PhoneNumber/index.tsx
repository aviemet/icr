import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber"

import { Anchor } from "@/Components"

const phoneUtil = PhoneNumberUtil.getInstance()

interface PhoneNumberProps {
	children: string
	format?: keyof typeof PhoneNumberFormat
}

const PhoneNumber = ({
	children,
	format = "NATIONAL",
}: PhoneNumberProps) => {

	const parsedNumber = phoneUtil.parseAndKeepRawInput(children, "US")

	return (
		<Anchor href={ `tel:${phoneUtil.format(parsedNumber, PhoneNumberFormat.E164)}` }>{ phoneUtil.format(parsedNumber, PhoneNumberFormat[format]) }</Anchor>
	)
}

export default PhoneNumber
