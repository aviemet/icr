import { Group, Stack, Title } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Switch, TextInput } from "@/components/Inputs"

import { type CriterionGroup } from "./CriteriaGroup"
import { CriteriaGroupsEditor } from "./CriteriaGroupsEditor"

interface OvertimeExemption {
	name: string
	active: boolean
	criteria: CriterionGroup[]
}

type OvertimeExemptionFormData = {
	overtime_exemption: OvertimeExemption
}

interface OvertimeExemptionsProps {
	onSubmit?: (exemption: OvertimeExemption) => void
	initialValue?: OvertimeExemption
}

export function OvertimeExemptions({ onSubmit, initialValue }: OvertimeExemptionsProps) {
	const initialData: OvertimeExemptionFormData = {
		overtime_exemption: initialValue || {
			name: "",
			active: true,
			criteria: [{}],
		},
	}

	const submitWith = async (data: OvertimeExemptionFormData) => {
		onSubmit?.(data.overtime_exemption)
	}

	return (
		<Form<OvertimeExemptionFormData>
			initialData={ initialData }
			submitWith={ submitWith }
			railsAttributes={ false }
		>
			<Stack>
				<Title order={ 2 }>Overtime Exemption</Title>

				<Group>
					<TextInput
						name="overtime_exemption.name"
						label="Name"
						required
						style={ { flex: 1 } }
					/>
					<Switch
						name="overtime_exemption.active"
						label="Active"
						mt={ 25 }
					/>
				</Group>

				<CriteriaGroupsEditor />

				<Group>
					<Submit>Save Exemption</Submit>
				</Group>
			</Stack>
		</Form>
	)
}
