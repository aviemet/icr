import { useState } from "react"
import { useTranslation } from "react-i18next"

import {
	Box,
	Button,
	Card,
	Container,
	Group,
	Page,
	Section,
	Stack,
	Table,
	Text,
	Title,
} from "@/components"
import { formatter, Routes } from "@/lib"

import EmployeesTable from "./EmployeesTable"
import PayrollTableFooter from "./PayrollTableFooter"

interface TimesheetsIndexProps {
	period_dates: [string, string]
	employees: Schema.EmployeesPersisted[]
	pagination: Schema.Pagination
}

export default function TimesheetsIndex({ period_dates, employees, pagination }: TimesheetsIndexProps) {
	const { t } = useTranslation()
	const [activeTab, setActiveTab] = useState<string>("all")

	const [periodStart, periodEnd] = period_dates
	const periodRange = periodStart && periodEnd ? formatter.datetime.range(periodStart, periodEnd) : ""
	const approvedCount = 0
	const totalCount = employees.length
	const pendingCount = 0
	const flaggedCount = 0
	const overtimeHours = 0
	const ptoHours = 0
	const dueInDays = 2

	return (
		<Page
			title={ t("views.timesheets.index.title") }
			breadcrumbs={ [
				{ title: t("views.timesheets.index.title"), href: Routes.timesheets() },
			] }
		>
			<Section>
				<Container size="xl">
					<Table.TableProvider
						selectable
						rows={ employees }
						pagination={ pagination }
						model="employees"
					>
						<Stack gap="lg">
							<Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
								<Title order={ 2 }>{ t("views.timesheets.index.title") }</Title>
								<Group gap="md" wrap="wrap">
									{ periodRange && (
										<Text size="sm" c="dimmed">
											{ t("views.timesheets.index.period_label", {
												range: periodRange,
												type: t("views.timesheets.index.period_type_bi_weekly"),
											}) }
										</Text>
									) }
									<Text size="sm" c="dimmed">
										{ t("views.timesheets.index.approved_count", {
											approved: approvedCount,
											total: totalCount,
										}) }
									</Text>
									{ dueInDays !== undefined && dueInDays !== null && (
										<Text size="sm" c="dimmed">
											{ t("views.timesheets.index.due_in_days", { count: dueInDays }) }
										</Text>
									) }
									<Button variant="filled">
										{ t("views.timesheets.index.export_summary") }
									</Button>
								</Group>
							</Group>

							<Group gap="md">
								<Card withBorder padding="md" style={ { minWidth: 120 } }>
									<Text size="xs" tt="uppercase" c="dimmed">{ t("views.timesheets.index.summary_pending") }</Text>
									<Text fw={ 600 } size="lg">{ pendingCount }</Text>
								</Card>
								<Card withBorder padding="md" style={ { minWidth: 120 } }>
									<Text size="xs" tt="uppercase" c="dimmed">{ t("views.timesheets.index.summary_flagged") }</Text>
									<Text fw={ 600 } size="lg">{ flaggedCount }</Text>
								</Card>
								<Card withBorder padding="md" style={ { minWidth: 120 } }>
									<Text size="xs" tt="uppercase" c="dimmed">{ t("views.timesheets.index.summary_overtime") }</Text>
									<Text fw={ 600 } size="lg">{ t("views.timesheets.index.summary_hours", { count: overtimeHours }) }</Text>
								</Card>
								<Card withBorder padding="md" style={ { minWidth: 120 } }>
									<Text size="xs" tt="uppercase" c="dimmed">{ t("views.timesheets.index.summary_pto") }</Text>
									<Text fw={ 600 } size="lg">{ t("views.timesheets.index.summary_hours", { count: ptoHours }) }</Text>
								</Card>
							</Group>

							<Box>
								<Group gap={ 0 } mb="sm">
									<Button
										variant={ activeTab === "all" ? "light" : "subtle" }
										size="xs"
										onClick={ () => setActiveTab("all") }
									>
										{ t("views.timesheets.index.tabs.all") }
									</Button>
									<Button
										variant={ activeTab === "needs_approval" ? "light" : "subtle" }
										size="xs"
										onClick={ () => setActiveTab("needs_approval") }
									>
										{ t("views.timesheets.index.tabs.needs_approval") } ({ pendingCount })
									</Button>
									<Button
										variant={ activeTab === "flagged" ? "light" : "subtle" }
										size="xs"
										onClick={ () => setActiveTab("flagged") }
									>
										{ t("views.timesheets.index.tabs.flagged") } ({ flaggedCount })
									</Button>
									<Button
										variant={ activeTab === "approved" ? "light" : "subtle" }
										size="xs"
										onClick={ () => setActiveTab("approved") }
									>
										{ t("views.timesheets.index.tabs.approved") }
									</Button>
								</Group>

								<EmployeesTable employees={ employees } />
							</Box>

							<PayrollTableFooter employeeCount={ employees.length } />
						</Stack>
					</Table.TableProvider>
				</Container>
			</Section>
		</Page>
	)
}
