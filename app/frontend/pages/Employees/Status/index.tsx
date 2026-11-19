import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import {
	AcceptOfferForm,
	CloseApplicationForm,
	OnboardingForm,
	ReconsiderForm,
	RejectOfferForm,
	ResignationForm,
	TerminationForm,
} from "@/domains/Employees/StatusChange"
import { StatusDesk } from "@/features"
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

	const statusLabel = employee.status
		? t(`views.employees.table.statuses.${employee.status}`, { defaultValue: employee.status })
		: "-"

	let form: React.ReactNode = null
	if(selectedTransition === "begin_onboarding") {
		form = <OnboardingForm employee={ employee } />
	} else if(selectedTransition === "close_application") {
		form = <CloseApplicationForm employee={ employee } />
	} else if(selectedTransition === "accept_offer") {
		form = <AcceptOfferForm employee={ employee } />
	} else if(selectedTransition === "reject_offer") {
		form = <RejectOfferForm employee={ employee } />
	} else if(selectedTransition === "record_resignation") {
		form = <ResignationForm employee={ employee } />
	} else if(selectedTransition === "process_termination") {
		form = <TerminationForm employee={ employee } />
	} else if(selectedTransition === "reconsider") {
		form = <ReconsiderForm employee={ employee } />
	}

	return (
		<StatusDesk
			title={ t("views.employees.status.title") }
			breadcrumbs={ [
				{ title: t("views.employees.index.title"), href: Routes.employees() },
				{ title: employee.person.name, href: Routes.employee(employee.slug) },
				{ title: t("views.employees.show.change_status") },
			] }
			heading={ t("views.employees.status.change_for", { name: employee.person.name }) }
			statusLabel={ statusLabel }
			transitionLabel={ t("views.employees.status.label") }
			options={ availableTransitions }
			value={ selectedTransition }
			onChange={ setSelectedTransition }
		>
			{ form }
		</StatusDesk>
	)
}

export default Status
