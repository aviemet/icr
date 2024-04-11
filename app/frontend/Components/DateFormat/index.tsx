import dayjs from 'dayjs'
import React from 'react'

interface DateProps {
	children: Date
	format?: string
}

const DateFormat = ({ children, format = 'YYYY/MM/DD' }: DateProps) => {
	return (
		<span>{ dayjs(children).format(format) }</span>
	)
}

export default DateFormat
