import { Grid, Heading, Link } from "@/Components"
import { Form, TextInput, Submit } from "@/Components/Form"
import { Routes } from "@/lib"
import { LAYOUTS } from "@/Layouts"
import { AuthPaperLayout } from "@/Features"

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
			<Form
				model="user"
				data={ { user } }
				to={ Routes.userConfirmation() }
			>
				<Grid>

					<Grid.Col>
						<div>
							<Heading order={ 3 }>Please check your email</Heading>
							<p>An email has been sent to the address provided. Please follow the link to confirm your account.</p>
							<p>If you don&apos;t receive an email, use the form below to resend it.</p>
						</div>
					</Grid.Col>

					<Grid.Col>
						<div>
							<TextInput name="email" placeholder="Email" autoComplete="Email" required />
						</div>
					</Grid.Col>

					<Grid.Col>
						<div>
							<Submit className="large">Resend confirmation instructions</Submit>
						</div>
					</Grid.Col>

				</Grid>
			</Form>
		</AuthPaperLayout>
	)
}

ConfirmationsNew.defaultLayout = LAYOUTS.auth

export default ConfirmationsNew
