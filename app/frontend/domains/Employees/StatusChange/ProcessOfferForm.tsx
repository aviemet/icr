import { useTranslation } from "react-i18next"

import { Grid, Group, Text } from "@/components"
import { Form, Submit } from "@/components/Form"
import { DateTimeFormatter } from "@/components/Formatters"
import { formatter, Routes } from "@/lib"

export interface ProcessOfferFormProps {
	employee: Schema.EmployeesShow
	offer: Schema.EmployeeOffersPersisted
}

export function ProcessOfferForm({ employee, offer }: ProcessOfferFormProps) {
	const { t } = useTranslation()
	const jobTitleName = offer.job_title?.name ?? "-"

	return (
		<Grid>
			<Grid.Col span={ { xxs: 12 } }>
				<Text size="sm">
					{ t("views.employees.status.process_offer.summary", {
						title: jobTitleName,
						rate: formatter.currency(offer.rate),
						period: offer.period,
					}) }
				</Text>
				{ offer.proposed_start_on && (
					<Text size="sm" c="dimmed" mt={ 4 }>
						{ t("views.employees.status.process_offer.effective") }:{ " " }
						<DateTimeFormatter format="dateShort">{ offer.proposed_start_on }</DateTimeFormatter>
					</Text>
				) }
			</Grid.Col>

			<Grid.Col span={ { xxs: 12 } }>
				<Group gap="sm">
					<Form
						action={ Routes.employeeOffer(employee.slug, offer.id) }
						method="put"
						initialData={ {
							return_to: "status",
							offer: { status: "accepted" },
						} }
					>
						<Submit>{ t("views.employees.status.process_offer.accept") }</Submit>
					</Form>

					<Form
						action={ Routes.employeeOffer(employee.slug, offer.id) }
						method="put"
						initialData={ {
							return_to: "status",
							offer: { status: "withdrawn" },
						} }
					>
						<Submit color="gray">{ t("views.employees.status.process_offer.withdraw") }</Submit>
					</Form>
				</Group>
			</Grid.Col>
		</Grid>
	)
}
