import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'

const phoneUtil = PhoneNumberUtil.getInstance()

interface PhoneNumberProps {
	children: string
	format?: keyof typeof PhoneNumberFormat
}

const PhoneNumber = ({
	children,
	format = "NATIONAL",
}: PhoneNumberProps) => {

	const parsedNumber = phoneUtil.parseAndKeepRawInput(children, 'US')

	return (
		<>{ phoneUtil.format(parsedNumber, PhoneNumberFormat[format]) }</>
	)
}

export default PhoneNumber
