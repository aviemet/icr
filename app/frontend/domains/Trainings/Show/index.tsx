import { useTranslation } from "react-i18next"

import { Box, DangerousHtml, Link } from "@/components"
import { ClockIcon } from "@/components/Icons"
import {
	CollectionPanel,
	DefinitionItem,
	DefinitionList,
	FormBand,
	FormBandStack,
	RecordRow,
} from "@/features"
import { Routes } from "@/lib"

import { plainTextFromHtml } from "../plainTextFromHtml"
import * as classes from "./Show.css"

interface TrainingShowDetailsProps {
	training: Schema.EmployeeTrainingsShow
}

export function TrainingShowDetails({ training }: TrainingShowDetailsProps) {
	const { t } = useTranslation()
	const clientsTrainings = training.clients_trainings ?? []
	const employeesTrainings = training.employees_trainings ?? []
	const hasDescription = plainTextFromHtml(training.description).length > 0

	return (
		<FormBandStack>
			<Box className={ classes.tileRow }>
				<FormBand
					title="Details"
					icon={ <ClockIcon size={ 16 } /> }
				>
					<DefinitionList>
						<DefinitionItem
							label={ t("views.trainings.show.duration") }
							value={ typeof training.estimated_minutes === "number"
								? t("views.trainings.index.minutes", { count: training.estimated_minutes })
								: "-" }
						/>
						<DefinitionItem
							label={ t("views.trainings.show.status") }
							value={ t(`views.trainings.availability.${training.status}`, { defaultValue: training.status }) }
						/>
					</DefinitionList>
				</FormBand>

				<CollectionPanel
					title={ t("views.trainings.show.linked_clients") }
					count={ clientsTrainings.length }
					emptyLabel={ t("views.trainings.show.no_clients") }
				>
					{ clientsTrainings.map((row) => (
						<RecordRow
							key={ row.id }
							title={ (
								<Link href={ Routes.client(row.client.slug) }>
									{ row.client.person?.name || row.client.slug }
								</Link>
							) }
							meta={ row.required ? t("views.trainings.show.required") : undefined }
						/>
					)) }
				</CollectionPanel>

				<CollectionPanel
					title={ t("views.trainings.show.assignments") }
					count={ employeesTrainings.length }
					emptyLabel={ t("views.trainings.show.no_assignments") }
				>
					{ employeesTrainings.map((row) => (
						<RecordRow
							key={ row.id }
							title={ (
								<Link href={ `${Routes.employee(row.employee.slug)}?tab=trainings` }>
									{ row.employee.person?.name || row.employee.slug }
								</Link>
							) }
							meta={ t(`views.trainings.status.${row.status}`, { defaultValue: row.status }) }
						/>
					)) }
				</CollectionPanel>
			</Box>

			<FormBand title={ t("views.trainings.show.description") }>
				{ hasDescription
					? <DangerousHtml>{ training.description }</DangerousHtml>
					: "-" }
			</FormBand>
		</FormBandStack>
	)
}
