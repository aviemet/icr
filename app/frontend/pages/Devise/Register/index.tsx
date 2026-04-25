import { useTranslation } from "react-i18next"

import { Box, Grid, Title, Link } from "@/components"
import { Form, Field, FormConsumer, Submit, type FormConsumerState } from "@/components/Form"
import { PasswordInput, TextInput } from "@/components/Inputs"
import { AuthPaperLayout } from "@/features"
import { Routes, withLayout } from "@/lib"

const Register = () => {
	const { t } = useTranslation()
	const defaultData = {
		user: {
			email: "",
			password: "",
			password_confirmation: "",
		},
	}

	const handleFormChange = (state: FormConsumerState) => {
		const data = state.getFormData()
		const user = data?.user as { password?: string, password_confirmation?: string } | undefined
		const password = user?.password ?? ""
		const confirmation = user?.password_confirmation ?? ""
		if(!state.slotProps) return
		if(confirmation !== "" && password !== confirmation) {
			state.slotProps.setError("user.password_confirmation", t("views.devise.register.errors.passwords_must_match"))
		} else {
			state.slotProps.clearErrors("user.password_confirmation")
		}
	}

	return (
		<AuthPaperLayout bottomLinks={ [
			<Link href={ Routes.newUserSession() } key="login">
				{ t("views.devise.shared.login") }
			</Link>,
		] }>
			<Form action={ Routes.userRegistration() } initialData={ defaultData }>
				<FormConsumer onChange={ handleFormChange } />
				<Grid>

					<Stack gap="md">
						<Title>{ t("views.devise.register.title") }</Title>

						<Field>
							<TextInput
								name="user.email"
								placeholder={ t("views.devise.register.email") }
								autoFocus
								autoComplete="Email"
								required
							/>
						</Field>

						<Field>
							<PasswordInput
								name="user.password"
								placeholder={ t("views.devise.register.password") }
								autoComplete="new-password"
								required
							/>
						</Field>

						<Field>
							<PasswordInput
								name="user.password_confirmation"
								placeholder={ t("views.devise.register.confirm_password") }
								autoComplete="new-password"
								required
							/>
						</Field>
					</Stack>

					<Box>
						<Field mb={ 16 }>
							<Submit className="large">{ t("views.devise.register.submit") }</Submit>
						</Field>
					</Box>

				</Grid>
			</Form>
		</AuthPaperLayout>
	)
}

export default withLayout(Register, "auth")
