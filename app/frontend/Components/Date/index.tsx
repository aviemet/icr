import React from 'react'
import { formatter } from '@/lib'

interface DateProps {
	children: string|Date|undefined
	format?: keyof typeof formatter.date
}

const Date = ({ children, format = 'short' }: DateProps) => {
	if(!children) return <></>

	return (
		<>{ formatter.date[format](children) }</>
	)
}

export default Date
