import { Stepper, Select } from "@mantine/core"
import { useState, useMemo } from "react"

import { Title, Page, Section } from "@/Components"
import { Routes } from "@/lib"

import CloseApplicationForm from "./CloseApplicationForm"
import OnboardingForm from "./OnboardingForm"
import ResignationForm from "./ResignationForm"
import TerminationForm from "./TerminationForm"

interface StatusChangeProps {
	employee: Schema.EmployeesShow
}

const StatusChange = ({ employee }: StatusChangeProps) => {
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

				<Stepper active={ selectedTransition ? 1 : 0 } mt="xl">
					<Stepper.Step label="Select Status Change">
						<Select
							label="Status Change"
							value={ selectedTransition }
							onChange={ handleTransitionChange }
							data={ availableTransitions }
							clearable={ false }
						/>
					</Stepper.Step>

					<Stepper.Step label="Complete Required Information">
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
					</Stepper.Step>
				</Stepper>
			</Section>
		</Page>
	)
}

export default StatusChange
