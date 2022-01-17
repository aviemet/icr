export default {}

export const colors = {
	white: 'gray',
	black: 'black',
	blueGray: 'blue-gray',
	gray: 'gray',
	brown: 'brown',
	deepOrange: 'deep-orange',
	orange: 'orange',
	amber: 'amber',
	yellow: 'yellow',
	lime: 'lime',
	lightGreen: 'light-green',
	green: 'green',
	teal: 'teal',
	cyan: 'cyan',
	lightBlue: 'light-blue',
	blue: 'blue',
	indigo: 'indigo',
	deepPurple: 'deep-purple',
	purple: 'purple',
	pink: 'pink',
	red: 'red',
}

export const colorClass = (prefix: string, color: Tcolors, weight?: string|number|Record<string,number>) => {
	let classWeight = weight
	if(color === 'white' || color === 'black') {
		weight = undefined
	} else if(typeof weight === 'object' && weight?.hasOwnProperty(color)) {
		classWeight = weight.color
	}

	return `${prefix}-${color}${weight && `-${classWeight}`}`
}
