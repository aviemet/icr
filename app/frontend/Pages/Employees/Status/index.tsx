import { Select } from "@mantine/core"
import { useState, useMemo } from "react"

import { Title, Page, Section, Grid } from "@/Components"
import {
	CloseApplicationForm,
	OnboardingForm,
	ResignationForm,
	TerminationForm,
} from "@/Features/Employees/StatusChange"
import { Routes } from "@/lib"

interface StatusProps {
	employee: Schema.EmployeesShow
}

const Status = ({ employee }: StatusProps) => {
	const [selectedTransition, setSelectedTransition] = useState<string>(() => {
		if(employee.status === "applicant") return "begin_onboarding"
		return ""
	})

	const handleTransitionChange = (value: string | null) => {
		if(value) setSelectedTransition(value)
	}

	const availableTransitions = useMemo(() => {
		switch(employee.status) {
			case "applicant":
				return [
					{ value: "begin_onboarding", label: "Begin Onboarding" },
					{ value: "close_application", label: "Close Application" },
				]
			case "employed":
				return [
					{ value: "record_resignation", label: "Record Resignation" },
					{ value: "process_termination", label: "Process Termination" },
				]
			default:
				return []
		}
	}, [employee.status])

	return (
		<Page
			title="Change Employee Status"
			breadcrumbs={ [
				{ title: "Employees", href: Routes.employees() },
				{ title: employee.person.name, href: Routes.employee(employee.slug) },
				{ title: "Change Status" },
			] }
		>
			<Section>
				<Title>Change Status for { employee.person.name }</Title>

				<Grid mt="xl">
					<Grid.Col span={ { base: 12, sm: 6, md: 4 } }>
						<Select
							label="Status Change"
							value={ selectedTransition }
							onChange={ handleTransitionChange }
							data={ availableTransitions }
							clearable={ false }
						/>
					</Grid.Col>
				</Grid>

				{ selectedTransition === "begin_onboarding" && (
					<OnboardingForm employee={ employee } />
				) }
				{ selectedTransition === "close_application" && (
					<CloseApplicationForm employee={ employee } />
				) }
				{ selectedTransition === "record_resignation" && (
					<ResignationForm employee={ employee } />
				) }
				{ selectedTransition === "process_termination" && (
					<TerminationForm employee={ employee } />
				) }
			</Section>
		</Page>
	)
}

export default Status
