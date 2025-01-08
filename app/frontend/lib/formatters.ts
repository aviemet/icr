import dayjs from 'dayjs'

export const currency = (amount: number, currency = 'USD') => {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
	})
	return formatter.format(amount)
}

export const datetime = {
	// Date formatters
	dateShort: (date: string | Date) => dayjs(new Date(date)).format('MM/DD/YYYY'),
	dateLong: (date: string | Date) => dayjs(new Date(date)).format('MM/DD/YYYY HH:mm:ss'),
	dateEnglish: (date: string | Date) => dayjs(new Date(date)).format('MM/DD/YYYY'),

	// Time formatters
	timeShort: (date: string | Date) => {
		const d = dayjs(new Date(date))
		return d.format(`${d.get('minutes') > 0 ? 'h:mm' : 'h'}a`)
	},
	timeLong: (date: string | Date) => dayjs(new Date(date)).format('hh:mm A'),
	timeFull: (date: string | Date) => dayjs(new Date(date)).format('HH:mm:ss'),

	// DateTime formatters
	dateTimeShort: (date: string | Date) => {
		const d = dayjs(new Date(date))
		return d.format(`${d.get('minutes') > 0 ? 'h:mm' : 'h'}a MM/DD/YY`)
	},
	dateTimeLong: (date: string | Date) => dayjs(new Date(date)).format('hh:mm A MM/DD/YYYY'),
	dateTimeFull: (date: string | Date) => dayjs(new Date(date)).format('hh:mm A dddd MM/DD/YYYY'),

	// Relative time formatters
	fromNow: (date: string | Date, relativeTime?: string | Date) => {
		return relativeTime === undefined
			? dayjs(new Date(date)).fromNow()
			: dayjs(new Date(relativeTime)).from(new Date(date))
	},
	toNow: (date: string | Date, relativeTime?: string | Date) => {
		return relativeTime === undefined
			? dayjs(new Date(date)).toNow()
			: dayjs(new Date(relativeTime)).to(new Date(date))
	},
	duration: (date: string | Date, relativeTime?: string | Date) => {
		const start = relativeTime === undefined ? dayjs() : dayjs(new Date(relativeTime))
		return start.from(new Date(date), true)
	},
}
