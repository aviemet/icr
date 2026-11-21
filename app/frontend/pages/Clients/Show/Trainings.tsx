import { ClientTrainings } from "@/domains/Clients/Trainings"

import { type ShowClientProps } from "."

const Trainings = ({ client, trainingOptions = [] }: ShowClientProps) => {
	return <ClientTrainings client={ client } trainingOptions={ trainingOptions } />
}

export default Trainings
