import { useTranslation } from "react-i18next"

import { Stack, Title, Text, Link, Box } from "@/components"
import { Field, Form, TextInput, Submit } from "@/components/Form"
import { AuthPaperLayout } from "@/features"
import { Routes, withLayout } from "@/lib"

interface IConfirmationsNew {
	user: Schema.User
}

const ConfirmationsNew = ({ user }: IConfirmationsNew) => {
	const { t } = useTranslation()

	return (
		<AuthPaperLayout bottomLinks={ [
			<Link href={ Routes.newUserRegistration() } key="register">
				{ t("views.devise.login.register") }
			</Link>,
			<Link href={ Routes.newUserSession() } key="login">
				{ t("views.devise.shared.login") }
			</Link>,
		] }>
			<Form
				model="user"
				data={ { user } }
				to={ Routes.userConfirmation() }
			>
				<Stack gap="lg" justify="space-between" flex={ 1 }>

					<Stack gap="md">
						<Title order={ 3 }>{ t("views.devise.confirmations.new.title") }</Title>
						<Text component="p" size="sm">
							{ t("views.devise.confirmations.new.body_sent") }
						</Text>
						<Text component="p" size="sm">
							{ t("views.devise.confirmations.new.body_resend") }
						</Text>

						<Field>
							<TextInput
								name="email"
								placeholder={ t("views.devise.shared.email") }
								autoComplete="Email"
								required
							/>
						</Field>
					</Stack>

					<Box>
						<Field>
							<Submit className="large">{ t("views.devise.confirmations.new.submit") }</Submit>
						</Field>
					</Box>

				</Stack>
			</Form>
		</AuthPaperLayout>
	)
}

export default withLayout(ConfirmationsNew, "auth")
