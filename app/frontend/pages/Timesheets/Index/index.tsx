import { useTranslation } from "react-i18next"

import { Container, Group, Page, Section, Title } from "@/components"
import { Routes } from "@/lib"

import EmployeesTable from "./EmployeesTable"

interface TimesheetsIndexProps {
	period_dates: [Date, Date]
	employees: Schema.EmployeesPersisted[]
	pagination: Schema.Pagination
}

export default function TimesheetsIndex({ period_dates, employees, pagination }: TimesheetsIndexProps) {
	const { t } = useTranslation()

	return (
		<Page
			title={ t("views.timesheets.index.title") }
			breadcrumbs={ [
				{ title: t("views.timesheets.index.title"), href: Routes.timesheets() },
			] }
		>
			<Section>
				<Container size="xl">
					<Group>
						<Title order={ 2 }>{ t("views.timesheets.index.title") }</Title>
					</Group>

					<EmployeesTable employees={ employees } />

				</Container>
			</Section>
		</Page>
	)
}
