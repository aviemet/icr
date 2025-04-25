import clsx from "clsx"
import { useTranslation } from "react-i18next"
import { type UseFormProps } from "use-inertia-form"

import { Grid, Title, Link } from "@/components"
import { Form, Field, TextInput, PasswordInput, Checkbox, Submit } from "@/components/Form"
import { AuthPaperLayout } from "@/features"
import { Routes, withLayout } from "@/lib"
import { usePageProps } from "@/lib/hooks"

import * as classes from "./Login.css"

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
	const { t } = useTranslation()
	const { settings } = usePageProps()

	const handleSubmit = ({ data }: UseFormProps<LoginFormData>) => {
		if(data.user.email === "" || data.user.password === "") {
			return false
		}
	}

	return (
		<AuthPaperLayout bottomLinks={ [
			<Link href={ Routes.newUserPassword() } key="reset">
				{ t("views.devise.login.reset_password") }
			</Link>,
			<Link href={ Routes.newUserRegistration() } key="register">
				{ t("views.devise.login.register") }
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
							<Title mb="xs">{ settings.company_name }</Title>
						</div>
					</Grid.Col>

					<Grid.Col>
						<Field>
							<TextInput
								name="email"
								placeholder={ t("views.devise.login.email") }
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
								placeholder={ t("views.devise.login.password") }
								autoComplete="current-password"
								required
							/>
						</Field>
					</Grid.Col>

					<Grid.Col>
						<Field>
							<Submit>{ t("views.devise.login.submit") }</Submit>
						</Field>
					</Grid.Col>

					<Grid.Col>
						<Field>
							<Checkbox name="remember_me" label={ t("views.devise.login.remember_me") } />
						</Field>
					</Grid.Col>

				</Grid>
			</Form>
		</AuthPaperLayout>

	)
}

export default withLayout(Login, "auth")
