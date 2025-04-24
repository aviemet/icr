import { type CheckboxGroupProps } from "@mantine/core"
import { useInertiaInput } from "use-inertia-form"

import { Checkbox } from "@/components/Inputs"

export interface FormCheckboxGroupProps extends CheckboxGroupProps {
	name: string
	model?: string
}

const FormCheckboxGroup = ({
	children,
	name,
	model,
	...props
}: FormCheckboxGroupProps) => {
	const { value, setValue } = useInertiaInput<string[]>({ name, model })

	const handleValueChange = (vals: string[]) => {
		setValue(vals)
	}

	return (
		<Checkbox.Group
			value={ value }
			onChange={ handleValueChange }
			{ ...props }
		>
			{ children }
		</Checkbox.Group>
	)
}

export default FormCheckboxGroup
