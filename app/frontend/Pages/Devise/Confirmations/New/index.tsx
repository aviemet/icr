import { Heading, Link } from '@/Components'
import { Form, TextInput, Submit } from '@/Components/Form'
import { Routes } from '@/lib'
import { LAYOUTS } from '@/Layouts'

interface IConfirmationsNew {
	user: Schema.User
}

const ConfirmationsNew = ({ user }: IConfirmationsNew) => {
	return (
		<Form
			model="user"
			data={ { user } }
			to={ Routes.userConfirmation() }
		>
			<div>
				<Heading order={ 3 }>Please check your email</Heading>
				<p>An email has been sent to the address provided. Please follow the link to confirm your account.</p>
				<p>If you don&apos;t receive an email, use the form below to resend it.</p>
			</div>

			<div>
				<TextInput name="email" placeholder="Email" autoComplete="Email" required />
			</div>

			<div>
				<Submit className="large">Resend confirmation instructions</Submit>
			</div>

			<Link href={ Routes.newUserRegistration() }>Register</Link>
			<Link href={ Routes.newUserSession() }>Log In Instead</Link>

		</Form>
	)
}

ConfirmationsNew.defaultLayout = LAYOUTS.auth

export default ConfirmationsNew
