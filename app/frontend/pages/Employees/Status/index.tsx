import { Select } from "@mantine/core"
import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"

import { Title, Page, Section, Grid } from "@/components"
import {
	AcceptOfferForm,
	CloseApplicationForm,
	OnboardingForm,
	ReconsiderForm,
	RejectOfferForm,
	ResignationForm,
	TerminationForm,
} from "@/domains/Employees/StatusChange"
import { Routes } from "@/lib"

interface StatusProps {
	employee: Schema.EmployeesShow
}

const Status = ({ employee }: StatusProps) => {
	const { t } = useTranslation()
	const [selectedTransition, setSelectedTransition] = useState<string>(() => {
		if(employee.status === "applicant") return "begin_onboarding"
		if(employee.status === "offered") return "accept_offer"
		if(employee.status === "employed") return "record_resignation"
		if(["declined", "terminated", "application_withdrawn"].includes(employee.status)) {
			return "reconsider"
		}
		return ""
	})

	const handleTransitionChange = (value: string | null) => {
		if(value) setSelectedTransition(value)
	}

	const availableTransitions = useMemo(() => {
		switch(employee.status) {
			case "applicant":
				return [
					{ value: "begin_onboarding", label: t("views.employees.status.transitions.begin_onboarding") },
					{ value: "close_application", label: t("views.employees.status.transitions.close_application") },
				]
			case "offered":
				return [
					{ value: "accept_offer", label: t("views.employees.status.transitions.accept_offer") },
					{ value: "reject_offer", label: t("views.employees.status.transitions.reject_offer") },
				]
			case "employed":
				return [
					{ value: "record_resignation", label: t("views.employees.status.transitions.record_resignation") },
					{ value: "process_termination", label: t("views.employees.status.transitions.process_termination") },
				]
			case "declined":
			case "terminated":
			case "application_withdrawn":
				return [
					{ value: "reconsider", label: t("views.employees.status.transitions.reconsider") },
				]
			default:
				return []
		}
	}, [employee.status, t])

	return (
		<Page
			title={ t("views.employees.status.title") }
			breadcrumbs={ [
				{ title: t("views.employees.index.title"), href: Routes.employees() },
				{ title: employee.person.name, href: Routes.employee(employee.slug) },
				{ title: t("views.employees.show.change_status") },
			] }
		>
			<Section>
				<Title>{ t("views.employees.status.change_for", { name: employee.person.name }) }</Title>

				<Grid mt="xl">
					<Grid.Col span={ { base: 12, sm: 6, md: 4 } }>
						<Select
							label={ t("views.employees.status.label") }
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
				{ selectedTransition === "accept_offer" && (
					<AcceptOfferForm employee={ employee } />
				) }
				{ selectedTransition === "reject_offer" && (
					<RejectOfferForm employee={ employee } />
				) }
				{ selectedTransition === "record_resignation" && (
					<ResignationForm employee={ employee } />
				) }
				{ selectedTransition === "process_termination" && (
					<TerminationForm employee={ employee } />
				) }
				{ selectedTransition === "reconsider" && (
					<ReconsiderForm employee={ employee } />
				) }
			</Section>
		</Page>
	)
}

export default Status
