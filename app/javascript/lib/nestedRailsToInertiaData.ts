const testData: RailsData = {
	user: {
		email: '',
		password: '',
	},
	company: {
		id: ''
	}
}

type RailsData = Record<string, Record<string, string|number>>

const nestedRailsToInertiaData = (data: RailsData): Record<string, string|number> => {
	const output = {}

	Object.keys(data).forEach(o => {
		for(const [key, value] of Object.entries(data[o])) {
			output[`${o}[${key}]`] = value
		}
	})

	return output
}

export default nestedRailsToInertiaData