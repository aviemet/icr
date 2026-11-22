import { DoctorPrescriptions } from "@/domains/Doctors/Prescriptions"

import { type ShowDoctorProps } from "."

const Prescriptions = ({ doctor }: ShowDoctorProps) => {
	return <DoctorPrescriptions doctor={ doctor } />
}

export default Prescriptions
