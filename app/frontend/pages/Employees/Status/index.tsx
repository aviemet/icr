import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { Text } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import {
	AcceptOfferForm,
	DeclineApplicationForm,
	MakeOfferForm,
	OnboardingForm,
	ProcessOfferForm,
	PromoteForm,
	ReconsiderForm,
	RejectOfferForm,
	ResignationForm,
	TerminationForm,
	WithdrawApplicationForm,
} from "@/domains/Employees/StatusChange"
import { StatusDesk } from "@/features"
import { Routes } from "@/lib"
import { usePageProps } from "@/lib/hooks"

interface StatusProps {
	employee: Schema.EmployeesShow
}

type StatusPageErrors = {
	base?: string | string[]
	event?: string | string[]
}

const OPEN_OFFER_STATUSES = new Set(["draft", "extended", "negotiating"])

function openOfferFor(employee: Schema.EmployeesShow) {
	return employee.offers.find(offer => OPEN_OFFER_STATUSES.has(offer.status)) ?? null
}

function errorMessages(errors: StatusPageErrors | undefined) {
	if(!errors) return []

	return Object.values(errors).flatMap((value) => {
		if(Array.isArray(value)) return value
		if(typeof value === "string") return [value]
		return []
	})
}

const Status = ({ employee }: StatusProps) => {
	const { t } = useTranslation()
	const page = usePageProps()
	const [selectedTransition, setSelectedTransition] = useState("")
	const openOffer = openOfferFor(employee)
	const gateErrors = errorMessages(page.errors)

	const availableTransitions = useMemo(() => {
		switch(employee.status) {
			case "applicant":
				return [
					{ value: "begin_onboarding", label: t("views.employees.status.transitions.begin_onboarding") },
					{ value: "make_offer", label: t("views.employees.status.transitions.make_offer") },
					{ value: "decline_application", label: t("views.employees.status.transitions.decline_application") },
					{ value: "withdraw_application", label: t("views.employees.status.transitions.withdraw_application") },
				]
			case "offered":
				return [
					{ value: "accept_offer", label: t("views.employees.status.transitions.accept_offer") },
					{ value: "reject_offer", label: t("views.employees.status.transitions.reject_offer") },
					{ value: "decline_application", label: t("views.employees.status.transitions.decline_application") },
					{ value: "withdraw_application", label: t("views.employees.status.transitions.withdraw_application") },
					...(openOffer
						? [{ value: "process_offer", label: t("views.employees.status.transitions.process_offer") }]
						: []),
				]
			case "employed":
				return [
					{ value: "promote", label: t("views.employees.status.transitions.promote") },
					...(openOffer
						? [{ value: "process_offer", label: t("views.employees.status.transitions.process_offer") }]
						: []),
					{ value: "record_resignation", label: t("views.employees.status.transitions.record_resignation") },
					{ value: "process_termination", label: t("views.employees.status.transitions.process_termination") },
				]
			case "declined":
			case "terminated":
			case "withdrawn":
				return [
					{ value: "reconsider", label: t("views.employees.status.transitions.reconsider") },
				]
			default:
				return []
		}
	}, [employee.status, openOffer, t])

	const statusLabel = employee.status
		? t(`views.employees.table.statuses.${employee.status}`, { defaultValue: employee.status })
		: "-"

	let form: React.ReactNode = null
	if(selectedTransition === "begin_onboarding") {
		form = <OnboardingForm employee={ employee } />
	} else if(selectedTransition === "make_offer") {
		form = <MakeOfferForm employee={ employee } />
	} else if(selectedTransition === "decline_application") {
		form = <DeclineApplicationForm employee={ employee } />
	} else if(selectedTransition === "withdraw_application") {
		form = <WithdrawApplicationForm employee={ employee } />
	} else if(selectedTransition === "accept_offer") {
		form = <AcceptOfferForm employee={ employee } />
	} else if(selectedTransition === "reject_offer") {
		form = <RejectOfferForm employee={ employee } />
	} else if(selectedTransition === "promote") {
		form = <PromoteForm employee={ employee } />
	} else if(selectedTransition === "process_offer" && openOffer) {
		form = <ProcessOfferForm employee={ employee } offer={ openOffer } />
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
			meta={ (
				<>
					{ employee.job_title && (
						<Text size="sm" c="dimmed" component="span">
							{ t("views.employees.show.overview.job_title") }: { String(employee.job_title.name) }
						</Text>
					) }
					{ employee.active_at && (
						<Text size="sm" c="dimmed" component="span">
							{ t("views.employees.show.overview.hire_date") }:{ " " }
							<DateTimeFormatter>{ employee.active_at }</DateTimeFormatter>
						</Text>
					) }
				</>
			) }
			statusLabel={ statusLabel }
			transitionLabel={ t("views.employees.status.label") }
			placeholder={ t("views.employees.status.select_action") }
			options={ availableTransitions }
			value={ selectedTransition }
			onChange={ setSelectedTransition }
		>
			{ gateErrors.length > 0 && (
				<>
					{ gateErrors.map(message => (
						<Text key={ message } c="red" size="sm" mb="sm">{ message }</Text>
					)) }
				</>
			) }
			{ form }
		</StatusDesk>
	)
}

export default Status
