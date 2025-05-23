import { NestedFields, NestedFieldsProps } from "use-inertia-form"

import FormGroup from "./FormGroup"

interface FieldsForProps extends NestedFieldsProps {
	legend?: string
}

const FieldsFor = ({ children, model, legend }: FieldsForProps) => {
	return (
		<NestedFields model={ model }>
			<FormGroup className="fields_for" legend={ legend }>
				{ children }
			</FormGroup>
		</NestedFields>
	)
}

export default FieldsFor
