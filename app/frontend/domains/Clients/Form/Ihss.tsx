import { Grid, Title } from "@/components"
import { useFormField } from "@/components/Form"

export function Ihss() {
	const [ihss] = useFormField("client.ihss")

	if(!ihss) return null

	return (
		<>
			<Grid.Col>
				<Title order={ 3 }>IHSS</Title>
			</Grid.Col>

			<Grid.Col>

			</Grid.Col>
		</>
	)
}
