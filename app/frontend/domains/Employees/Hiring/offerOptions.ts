export const OFFER_PERIOD_OPTIONS = [
	{ value: "hourly", label: "Hourly" },
	{ value: "salary", label: "Salary" },
]

export const OFFER_OPEN_STATUS_OPTIONS = [
	{ value: "draft", label: "Draft" },
	{ value: "extended", label: "Extended" },
	{ value: "negotiating", label: "Negotiating" },
]

export const OFFER_STATUS_OPTIONS = [
	...OFFER_OPEN_STATUS_OPTIONS,
	{ value: "accepted", label: "Accepted" },
	{ value: "declined", label: "Declined" },
	{ value: "withdrawn", label: "Withdrawn" },
]
