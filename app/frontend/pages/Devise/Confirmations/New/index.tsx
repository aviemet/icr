import { Grid, Title, Link, Box } from "@/components"
import { Form, Submit } from "@/components/Form"
import { TextInput } from "@/components/Inputs"
import { AuthPaperLayout } from "@/features"
import { Routes, withLayout } from "@/lib"

interface IConfirmationsNew {
	user: Schema.User
}

const ConfirmationsNew = ({ user }: IConfirmationsNew) => {
	return (
		<AuthPaperLayout bottomLinks={ [
			<Link href={ Routes.newUserRegistration() } key="register">
				Register
			</Link>,
			<Link href={ Routes.newUserSession() } key="login">
				Log In Instead
			</Link>,
		] }>
			<Form action={ Routes.userConfirmation() } initialData={ { user } }>
				<Grid>

					<Grid.Col>
						<Box>
							<Title order={ 3 }>Please check your email</Title>
							<p>An email has been sent to the address provided. Please follow the link to confirm your account.</p>
							<p>If you don&apos;t receive an email, use the form below to resend it.</p>
						</Box>
					</Grid.Col>

					<Grid.Col>
						<Box>
							<TextInput name="user.email" placeholder="Email" autoComplete="Email" required />
						</Box>
					</Grid.Col>

					<Grid.Col>
						<Box>
							<Submit className="large">Resend confirmation instructions</Submit>
						</Box>
					</Grid.Col>

				</Grid>
			</Form>
		</AuthPaperLayout>
	)
}

export default withLayout(ConfirmationsNew, "auth")
