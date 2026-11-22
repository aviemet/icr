import { useTranslation } from "react-i18next"

import { Avatar, Link, Text } from "@/components"
import { RecordShowShell } from "@/features"
import { initials, Routes } from "@/lib"

import Clients from "./Clients"
import Diagnoses from "./Diagnoses"
import HospitalVisits from "./HospitalVisits"
import Overview from "./Overview"
import Prescriptions from "./Prescriptions"

export interface ShowDoctorProps {
	doctor: Schema.DoctorsShow
	can_update?: boolean
}

const ShowDoctor = ({ doctor, can_update = false }: ShowDoctorProps) => {
	const { t } = useTranslation()
	const title = doctor?.person?.name || doctor?.name || t("views.doctors.show.title")

	return (
		<RecordShowShell
			title={ title }
			breadcrumbs={ [
				{ title: t("views.doctors.index.title"), href: Routes.doctors() },
				{ title, href: Routes.doctor(doctor.slug) },
			] }
			avatar={ (
				<Avatar radius="xl" size={ 44 } color="brand">
					{ initials(title) ?? "?" }
				</Avatar>
			) }
			meta={ (
				<>
					{ doctor.specialty && (
						<Text size="sm" c="dimmed" component="span">
							{ doctor.specialty }
						</Text>
					) }
					{ doctor.practice_name && (
						<Text size="sm" c="dimmed" component="span">
							{ doctor.practice_name }
						</Text>
					) }
				</>
			) }
			actions={ can_update
				? (
					<Link as="button" href={ Routes.editDoctor(doctor.slug) } buttonProps={ { variant: "light" } }>
						{ t("views.doctors.edit.title") }
					</Link>
				)
				: undefined }
			tabs={ [
				{ id: "overview", label: t("views.doctors.show.tabs.overview"), panel: <Overview doctor={ doctor } /> },
				{ id: "clients", label: t("views.doctors.show.tabs.clients"), panel: <Clients doctor={ doctor } /> },
				{ id: "prescriptions", label: t("views.doctors.show.tabs.prescriptions"), panel: <Prescriptions doctor={ doctor } /> },
				{ id: "diagnoses", label: t("views.doctors.show.tabs.diagnoses"), panel: <Diagnoses doctor={ doctor } /> },
				{
					id: "hospital_visits",
					label: t("views.doctors.show.tabs.hospital_visits"),
					panel: <HospitalVisits doctor={ doctor } />,
				},
			] }
		/>
	)
}

export default ShowDoctor
