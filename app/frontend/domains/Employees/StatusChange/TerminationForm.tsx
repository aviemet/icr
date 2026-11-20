import { Grid, Title } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Switch, Textarea } from "@/components/Inputs"
import { Routes } from "@/lib"

import {
	OffboardingLastDayFields,
	OffboardingScheduleNotice,
	useOffboardingLastDayState,
} from "./OffboardingLastDayFields"
import { useOffboardSubmit } from "./useOffboardSubmit"

export interface TerminationFormProps {
	employee: Schema.EmployeesShow
}

export function TerminationForm({ employee }: TerminationFormProps) {
	const lastDay = useOffboardingLastDayState()
	const submitWith = useOffboardSubmit(employee.slug)

	return (
		<Form
			action={ Routes.statusEmployee(employee.slug) }
			method="put"
			initialData={ {
				employee: {
					event: "terminate",
					inactive_at: lastDay.date,
					inactive_at_time: "",
					eligible_for_hire: true,
					termination_reason: "",
				},
			} }
			submitWith={ submitWith }
		>
			<Grid>
				<Grid.Col span={ 12 }>
					<Title>Processing Termination</Title>
				</Grid.Col>

				<OffboardingLastDayFields
					date={ lastDay.date }
					time={ lastDay.time }
					onDateChange={ lastDay.setDate }
					onTimeChange={ lastDay.setTime }
				/>

				<Grid.Col
					span={ { xxs: 12, xs: 4 } }
					style={ { display: "flex", alignItems: "flex-end", justifyContent: "flex-end" } }
				>
					<Switch
						name="employee.eligible_for_hire"
						label="Eligible for rehire"
						defaultChecked
					/>
				</Grid.Col>

				<Grid.Col span={ { xxs: 12 } }>
					<Textarea
						name="employee.termination_reason"
						label="Notes Regarding Termination"
						placeholder="Enter termination details"
						required
					/>
				</Grid.Col>

				<Grid.Col span={ 12 }>
					<OffboardingScheduleNotice
						label="Termination will be processed at"
						date={ lastDay.date }
						time={ lastDay.time }
					/>
				</Grid.Col>

				<Grid.Col>
					<Submit>{ lastDay.isFuture ? "Schedule Termination" : "Process Termination" }</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
