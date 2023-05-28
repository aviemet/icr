import { useState } from 'react'

const useBooleanToggle = (initial: boolean): [boolean, () => void] => {
	const [value, setValue] = useState(initial)
	return [value, () => setValue(bool => !bool)]
}

export default useBooleanToggle
