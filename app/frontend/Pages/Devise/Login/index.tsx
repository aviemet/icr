import { Grid, Heading, Link } from "@/Components"
import { Form, Field, TextInput, PasswordInput, Checkbox, Submit } from "@/Components/Form"
import { Routes } from "@/lib"
import { type UseFormProps } from "use-inertia-form"
import { LAYOUTS } from "@/Layouts"

import cx from "clsx"
import * as classes from "./Login.css"
import { usePageProps } from "@/lib/hooks"
import { AuthPaperLayout } from "@/Features"

type LoginFormData = {
	user: {
		email: string
		password: string
		remember_me: boolean
	}
}

const defaultData = {
	user: {
		email: "",
		password: "",
		remember_me: false,
	},
}

const Login = () => {
	const { settings } = usePageProps()

	const handleSubmit = ({ data }: UseFormProps<LoginFormData>) => {
		if(data.user.email === "" || data.user.password === "") {
			return false
		}
	}

	return (
		<AuthPaperLayout bottomLinks={ [
			<Link href={ Routes.newUserPassword() } key="reset">
				Reset Password
			</Link>,
			<Link href={ Routes.newUserRegistration() } key="register">
				Register
			</Link>,
		] }>
			<Form
				model="user"
				data={ defaultData }
				to={ Routes.newUserSession() }
				onSubmit={ handleSubmit }
			>
				<Grid>

					<Grid.Col>
						<div>
							<Heading mb="xs">{ settings.company_name }</Heading>
						</div>
					</Grid.Col>

					<Grid.Col>
						<Field>
							<TextInput
								name="email"
								placeholder="Email"
								autoFocus
								autoComplete="Email"
								required
								pattern=".+@.+\..+"
							/>
						</Field>
					</Grid.Col>

					<Grid.Col>
						<Field>
							<PasswordInput
								name="password"
								placeholder="Password"
								autoComplete="current-password"
								required
							/>
						</Field>
					</Grid.Col>

					<Grid.Col>
						<Field>
							<Submit>Log In</Submit>
						</Field>
					</Grid.Col>

					<Grid.Col>
						<Field>
							<Checkbox name="remember_me" label="Remember Me" />
						</Field>
					</Grid.Col>

				</Grid>
			</Form>
		</AuthPaperLayout>

	)
}

Login.defaultLayout = LAYOUTS.auth

export default Login
