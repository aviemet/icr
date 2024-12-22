export default function greeting() {
	const hour = new Date().getHours()
	const welcomeTypes = ['Good morning', 'Good afternoon', 'Good evening']

	let greeting: string

	if(hour < 12) greeting = welcomeTypes[0]
	else if(hour < 18) greeting = welcomeTypes[1]
	else greeting = welcomeTypes[2]

	return greeting
}
