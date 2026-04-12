import { useTranslation } from "react-i18next"
import { type UseFormProps } from "use-inertia-form"

import { Stack, Title, Text, Link, Box } from "@/components"
import { Form, Field, TextInput, PasswordInput, CheckboxInput, Submit } from "@/components/Form"
import { AuthPaperLayout } from "@/features"
import { Routes, withLayout } from "@/lib"
import { usePageProps } from "@/lib/hooks"

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
				<Stack gap="lg" justify="space-between" flex={ 1 }>

					<Stack gap="lg">
						<Stack gap={ 4 }>
							<Title order={ 1 } size="h2">
								{ settings.company_name }
							</Title>
							<Text size="sm" c="dimmed">
								{ t("views.devise.login.subtitle") }
							</Text>
						</Stack>

						<Stack gap="md">
							<Field>
								<TextInput
									name="email"
									placeholder={ t("views.devise.shared.email") }
									autoFocus
									autoComplete="Email"
									required
									pattern=".+@.+\..+"
								/>
							</Field>

							<Field>
								<PasswordInput
									name="password"
									placeholder={ t("views.devise.login.password") }
									autoComplete="current-password"
									required
								/>
							</Field>

							<Field>
								<CheckboxInput name="remember_me" label={ t("views.devise.login.remember_me") } />
							</Field>
						</Stack>
					</Stack>

					<Box>
						<Field>
							<Submit>{ t("views.devise.login.submit") }</Submit>
						</Field>
					</Box>

				</Stack>
			</Form>
		</AuthPaperLayout>

	)
}

export default withLayout(Login, "auth")
