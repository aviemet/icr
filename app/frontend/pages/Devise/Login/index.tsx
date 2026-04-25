import { useTranslation } from "react-i18next"

import { Box, Grid, Title, Link, Text } from "@/components"
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
						<Title order={ 1 } size="h2">
							{ settings.company_name }
						</Title>
						<Text size="sm" c="dimmed">
							{ t("views.devise.login.subtitle") }
						</Text>
					</Grid.Col>

					<Grid.Col>
						<Field>
							<TextInput
								name="user.email"
								placeholder={ t("views.devise.shared.email") }
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
							<Checkbox name="user.remember_me" label={ t("views.devise.login.remember_me") } />
						</Field>
					</Grid.Col>

					<Grid.Col>
						<Box>
							<Field>
								<Submit className="large">{ t("views.devise.login.submit") }</Submit>
							</Field>
						</Box>
					</Grid.Col>

				</Grid>
			</Form>
		</AuthPaperLayout>
	)
}

export default withLayout(Login, "auth")
