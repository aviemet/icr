import { type HeaderProps } from 'react-big-calendar'

const MonthHeader = ({ date, label, localizer }: HeaderProps) => {
	return (
		<div>{ label }</div>
	)
}

export default MonthHeader
