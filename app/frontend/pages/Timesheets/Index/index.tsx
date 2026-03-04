import { useTranslation } from "react-i18next"

import { Container, Group, Page, Section, Stack, Tabs, Title } from "@/components"

import EmployeesTable from "./EmployeesTable"
import PayPeriodsTable from "./PayPeriodsTable"

interface TimesheetsIndexProps {
	employees: Schema.EmployeesIndex[]
}

export default function TimesheetsIndex({ employees }: TimesheetsIndexProps) {
	const { t } = useTranslation()

	return (
		<Page
			title={ t("views.payroll.index.title") }
			breadcrumbs={ [
				{ title: t("views.payroll.index.title"), href: "/payroll" },
			] }
		>
			<Section>
				<Container size="xl">
					<Stack>
						<Group>
							<Title order={ 2 }>{ t("views.payroll.index.title") }</Title>
						</Group>

						<Tabs urlControlled defaultValue="employees">
							<Tabs.List>
								<Tabs.Tab value="employees">{ t("views.payroll.index.tabs.employees") }</Tabs.Tab>
								<Tabs.Tab value="pay_periods">{ t("views.payroll.index.tabs.pay_periods") }</Tabs.Tab>
							</Tabs.List>

							<Tabs.Panel value="employees" pt="md">
								<EmployeesTable employees={ employees } />
							</Tabs.Panel>

							<Tabs.Panel value="pay_periods" pt="md">
								<PayPeriodsTable />
							</Tabs.Panel>
						</Tabs>
					</Stack>
				</Container>
			</Section>
		</Page>
	)
}
