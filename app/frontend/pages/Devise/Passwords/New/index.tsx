import { useTranslation } from "react-i18next"

import { Grid, Title, Link } from "@/components"
import { Field, Form, Submit } from "@/components/Form"
import { TextInput } from "@/components/Inputs"
import { AuthPaperLayout } from "@/features"
import { Routes, withLayout } from "@/lib"

const PasswordsNew = () => {
	const { t } = useTranslation()
	const defaultData = { user: { email: "" } }

	return (
		<AuthPaperLayout bottomLinks={ [
			<Link href={ Routes.newUserSession() } key="login">
				{ t("frontend.pages.devise.shared.login") }
			</Link>,
		] }>
			<Form action={ Routes.newUserPassword() } initialData={ defaultData }>
				<Grid>

					<Grid.Col>
						<div>
							<Title>{ t("frontend.pages.devise.passwords.new.title") }</Title>
						</div>
					</Grid.Col>

					<Grid.Col>
						<Field>
							<TextInput
								name="user.email"
								placeholder={ t("frontend.pages.devise.shared.email") }
								autoFocus
								autoComplete="Email"
							/>
						</Field>
					</Grid.Col>

					<Grid.Col>
						<Field>
							<Submit>{ t("frontend.pages.devise.passwords.new.submit") }</Submit>
						</Field>
					</Grid.Col>

				</Grid>
			</Form>
		</AuthPaperLayout>
	)
}

export default withLayout(PasswordsNew, "auth")
