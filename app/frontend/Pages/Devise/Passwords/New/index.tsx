import { Grid, Title, Link } from "@/Components"
import { Field, Form, TextInput, Submit } from "@/Components/Form"
import { AuthPaperLayout } from "@/Features"
import { Routes, withLayout } from "@/lib"

type TPasswordsNewFormData = {
	email: string
}

const PasswordsNew = () => {
	const defaultData: TPasswordsNewFormData = {
		email: "",
	}

	return (
		<AuthPaperLayout bottomLinks={ [
			<Link href={ Routes.newUserSession() } key="login">
				Log In
			</Link>,
		] }>
			<Form model="user" data={ defaultData } to={ Routes.newUserPassword() }>
				<Grid>

					<Grid.Col>
						<div>
							<Title>Reset Password</Title>
						</div>
					</Grid.Col>

					<Grid.Col>
						<Field>
							<TextInput name="email" placeholder="Email" autoFocus autoComplete="Email" />
						</Field>
					</Grid.Col>

					<Grid.Col>
						<Field>
							<Submit>Send Reset Instructions</Submit>
						</Field>
					</Grid.Col>

				</Grid>
			</Form>
		</AuthPaperLayout>
	)
}

export default withLayout(PasswordsNew, "auth")
