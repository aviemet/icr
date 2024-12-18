import dayjs from 'dayjs'

export const currency = (amount: number, currency = 'USD') => {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
	})
	return formatter.format(amount)
}

export const date = {
	short: (date: string | Date) => dayjs(new Date(date)).format('MM/DD/YYYY'),
	long: (date: string | Date) => dayjs(new Date(date)).format('MM/DD/YYYY HH:mm:ss'),
	english: (date: string | Date) => dayjs(new Date(date)).format('MM/DD/YYYY'),
	from: (date: string | Date, relativeTime?: string | Date) => {
		if(relativeTime === undefined) {
			return dayjs(new Date(date)).fromNow()
		}
		return dayjs(new Date(relativeTime)).from(new Date(date))
	},
	to: (date: string | Date, relativeTime?: string | Date) => {
		if(relativeTime === undefined) {
			return dayjs(new Date(date)).toNow()
		}
		return dayjs(new Date(relativeTime)).to(new Date(date))
	},
	duration: (date: string | Date, relativeTime?: string | Date) => {
		const start = relativeTime === undefined ? dayjs() : dayjs(new Date(relativeTime))
		return start.from(new Date(date), true)
	},
}

export const time = {
	short: (date: string | Date) => {
		const d = dayjs(new Date(date))
		let formatString = 'h'
		if(d.get('minutes') > 0) {
			formatString += ':mm'
		}
		return d.format(`${formatString}a`)
	},
	full: (date: string | Date) => dayjs(new Date(date)).format('HH:mm::ss:SSS Z'),
}
