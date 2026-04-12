import { useTranslation } from "react-i18next"

import { Stack, Title, Link, Box } from "@/components"
import { Field, Form, TextInput, Submit } from "@/components/Form"
import { AuthPaperLayout } from "@/features"
import { Routes, withLayout } from "@/lib"

type TPasswordsNewFormData = {
	email: string
}

const PasswordsNew = () => {
	const { t } = useTranslation()
	const defaultData: TPasswordsNewFormData = {
		email: "",
	}

	return (
		<AuthPaperLayout bottomLinks={ [
			<Link href={ Routes.newUserSession() } key="login">
				{ t("views.devise.shared.login") }
			</Link>,
		] }>
			<Form model="user" data={ defaultData } to={ Routes.newUserPassword() }>
				<Stack gap="lg" justify="space-between" flex={ 1 }>

					<Stack gap="md">
						<Title>{ t("views.devise.passwords.new.title") }</Title>

						<Field>
							<TextInput
								name="email"
								placeholder={ t("views.devise.shared.email") }
								autoFocus
								autoComplete="Email"
							/>
						</Field>
					</Stack>

					<Box>
						<Field>
							<Submit>{ t("views.devise.passwords.new.submit") }</Submit>
						</Field>
					</Box>

				</Stack>
			</Form>
		</AuthPaperLayout>
	)
}

export default withLayout(PasswordsNew, "auth")
