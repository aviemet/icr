import { useForm } from "use-inertia-form"

import { Grid, Title } from "@/components"
import { Checkbox } from "@/components/Form"

import { type ClientFormData } from "."


const Ihss = () => {
	const { getData } = useForm<ClientFormData>()

	return (
		<>
			<Grid.Col>
				<Checkbox name="ihss" label="Client has IHSS hours" />
			</Grid.Col>
			{ getData("client.ihss") && (
				<>
					<Grid.Col>
						<Title order={ 3 }>IHSS</Title>
					</Grid.Col>

					<Grid.Col>

					</Grid.Col>
				</>
			) }
		</>
	)
}

export default Ihss
