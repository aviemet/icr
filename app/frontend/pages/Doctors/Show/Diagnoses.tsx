import { DoctorDiagnoses } from "@/domains/Doctors/Diagnoses"

import { type ShowDoctorProps } from "."

const Diagnoses = ({ doctor }: ShowDoctorProps) => {
	return <DoctorDiagnoses doctor={ doctor } />
}

export default Diagnoses
