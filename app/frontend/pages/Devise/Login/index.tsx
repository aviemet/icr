import { useTranslation } from "react-i18next"

import { Grid, Title, Link } from "@/components"
import { Form, Field, Submit } from "@/components/Form"
import { Checkbox, PasswordInput, TextInput } from "@/components/Inputs"
import { AuthPaperLayout } from "@/features"
import { Routes, withLayout } from "@/lib"
import { usePageProps } from "@/lib/hooks"

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

	return (
		<AuthPaperLayout bottomLinks={ [
			<Link href={ Routes.newUserPassword() } key="reset">
				{ t("views.devise.login.reset_password") }
			</Link>,
			<Link href={ Routes.newUserRegistration() } key="register">
				{ t("views.devise.login.register") }
			</Link>,
		] }>
			<Form action={ Routes.newUserSession() } initialData={ defaultData }>
				<Grid>

					<Grid.Col>
						<div>
							<Title mb="xs">{ settings.company_name }</Title>
						</div>
					</Grid.Col>

					<Grid.Col>
						<Field>
							<TextInput
								name="user.email"
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
								name="user.password"
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
							<Checkbox name="user.remember_me" label={ t("views.devise.login.remember_me") } />
						</Field>
					</Grid.Col>

				</Grid>
			</Form>
		</AuthPaperLayout>
	)
}

export default withLayout(Login, "auth")
