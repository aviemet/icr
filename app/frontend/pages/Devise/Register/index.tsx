import { useTranslation } from "react-i18next"
import { type UseFormProps } from "use-inertia-form"

import { Box, Grid, Title, Link } from "@/components"
import { Form, TextInput, PasswordInput, Submit, Field } from "@/components/Form"
import { AuthPaperLayout } from "@/features"
import { Routes, withLayout } from "@/lib"

type TRegisterFormData = {
	user: {
		email: string
		password: string
		password_confirmation: string
	}
}

const Register = () => {
	const { t } = useTranslation()

	const handleFormChange = ({ data }: UseFormProps<TRegisterFormData>) => {
		// console.log({ data })
	}

	const handlePasswordChange = (value: string | number, { data, getError, clearErrors }: UseFormProps<TRegisterFormData>) => {
		if(getError("user.password") || getError("user.password_confirmation")) {
			if(data.user.password === data.user.password_confirmation) {
				clearErrors("user.password")
				clearErrors("user.password_confirmation")
			}
		}
	}

	const handleSubmit = ({ data, setError, errors, transform }: UseFormProps<TRegisterFormData>) => {
		if(data.user.password !== data.user.password_confirmation) {
			setError("user.password_confirmation", t("views.devise.register.errors.passwords_must_match"))
			return false
		}
	}

	const handleEmailBlur = (value: string | number, form: UseFormProps<TRegisterFormData>) => {
		// console.log({ value, form })
	}

	return (
		<AuthPaperLayout bottomLinks={ [
			<Link href={ Routes.newUserSession() } key="login">
				{ t("views.devise.register.login_instead") }
			</Link>,
		] }>
			<Form
				data={ {
					user: {
						email: "",
						password: "",
						password_confirmation: "",
					},
				} }
				model="user"
				to={ Routes.userRegistration() }
				onChange={ handleFormChange }
				onSubmit={ handleSubmit }
			>
				<Grid>

					<Grid.Col>
						<Box>
							<Title>{ t("views.devise.register.title") }</Title>
						</Box>
					</Grid.Col>

					<Grid.Col>
						<Field>
							<TextInput
								name="email"
								placeholder={ t("views.devise.register.email") }
								autoFocus
								autoComplete="Email"
								required
								onBlur={ handleEmailBlur }
							/>
						</Field>
					</Grid.Col>

					<Grid.Col>
						<Field>
							<PasswordInput
								name="password"
								placeholder={ t("views.devise.register.password") }
								autoComplete="new-password"
								required
								onChange={ handlePasswordChange }
							/>
						</Field>
					</Grid.Col>

					<Grid.Col>
						<Field>
							<PasswordInput
								name="password_confirmation"
								placeholder={ t("views.devise.register.confirm_password") }
								autoComplete="new-password"
								required
								onChange={ handlePasswordChange }
							/>
						</Field>
					</Grid.Col>

					<Grid.Col>
						<Field mb={ 16 }>
							<Submit className="large">{ t("views.devise.register.submit") }</Submit>
						</Field>
					</Grid.Col>

				</Grid>
			</Form>
		</AuthPaperLayout>
	)
}

export default withLayout(Register, "auth")
