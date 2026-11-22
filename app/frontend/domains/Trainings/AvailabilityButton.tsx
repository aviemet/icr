import { router } from "@inertiajs/react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components"
import { Routes } from "@/lib"

interface TrainingAvailabilityButtonProps {
	training: Pick<Schema.EmployeeTrainingsEdit, "id" | "status">
}

export function TrainingAvailabilityButton({ training }: TrainingAvailabilityButtonProps) {
	const { t } = useTranslation()
	const isActive = training.status === "active"

	return (
		<Button
			variant="light"
			size="sm"
			color={ isActive ? "red" : "green" }
			onClick={ () => {
				router.put(Routes.statusTraining(training.id), {}, {
					preserveScroll: true,
				})
			} }
		>
			{ isActive
				? t("views.trainings.actions.retire")
				: t("views.trainings.actions.offer_again") }
		</Button>
	)
}
