import { Grid, Title } from "@/Components"
import { useForm } from "use-inertia-form"
import { type ClientFormData } from "."
import { Checkbox } from "@/Components/Form"

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
